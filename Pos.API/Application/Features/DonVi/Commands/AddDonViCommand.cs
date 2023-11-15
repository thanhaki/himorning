using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;
using System.Linq.Expressions;
using static Pos.API.Constans.CmContext;

namespace User.API.Application.Features.DonVi.Commands
{
    public class AddDonViCommand
    {
        public class AddDonViRequest : IRequest<int>
        {
            public string? TenDonVi { get; set; }
            public string? DiaChiDonVi { get; set; }
            public string? DienThoaiLienHe { get; set; }
            public string? Email { get; set; }
            public string? Password { get; set; }
        }

        public class Handler : IRequestHandler<AddDonViRequest, int>
        {
            private readonly IDonViRepository _donViRepository;
            private readonly IUserRepository _userRepository;
            private readonly IEmailService _emailService;
            private readonly IVerifyCodeRepository _verifyCodeRepository;

            private readonly IMapper _mapper;
            private readonly ILogger<AddDonViCommand> _logger;
            public Handler(
                IDonViRepository donViRepository, 
                IUserRepository userRepository,
                IEmailService emailService,
                IMapper mapper, ILogger<AddDonViCommand> logger, 
                IVerifyCodeRepository verifyCodeRepository)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
                _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _verifyCodeRepository = verifyCodeRepository;
            }

            public async Task<int> Handle(AddDonViRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var donVi = _mapper.Map<M_DonVi>(request);

                    // check phone number/email
                    Expression<Func<M_User, bool>> predicate = u => (u.Email == request.Email || u.Phone == request.DienThoaiLienHe) && u.Deleted == 0;
                    var userExists = await _userRepository.GetFirstOrDefaultAsync(predicate);
                    if (userExists != null) return -1;

                    _donViRepository.BeginTransactionAsync();
                    // Get next code DonVi
                    Func<IQueryable<M_DonVi>, IOrderedQueryable<M_DonVi>> orderingFunc = x => x.OrderByDescending(d => d.DonVi);
                    var maxDonVi = await _donViRepository.GetMaxIdAsync(orderingFunc);
                    int nextMaDonVi = maxDonVi == null ? 1 : maxDonVi.DonVi + 1;

                    donVi.DonVi = nextMaDonVi;
                    donVi.GoiDichVu = (int)GOI_DICH_VU.FREE;
                    donVi.TinhTrang = (int)TINH_TRANG_DON_VI.DE_XUAT;
                    donVi.NgayGiaHan = Utilities.GetDateTimeSystem().AddDays(90);
                    await _donViRepository.AddAsync(donVi);

                    // Get next code user
                    Func<IQueryable<M_User>, IOrderedQueryable<M_User>> orderingUser = x => x.OrderByDescending(d => d.No_User);
                    var user = _mapper.Map<M_User>(request);
                    var maxUser = await _userRepository.GetMaxIdAsync(orderingUser);
                    int userNo = maxUser == null ? 1 : maxUser.No_User + 1;

                    user.No_User = userNo;
                    user.DonVi = nextMaDonVi;
                    user.Password = Utilities.Encrypt(user.Password);
                    await _userRepository.AddAsync(user);

                    // Send mail verify code
                    T_VerifyCode verifyCode = new T_VerifyCode();
                    verifyCode.DonVi = nextMaDonVi;
                    verifyCode.CodeVerify = Utilities.RandomString(6);

                    await _verifyCodeRepository.AddAsync(verifyCode);

                    string p1 = @"<p>We have received your request to register for a free account to use with the Hi Morning system.</p>";
                    string p3 = @"<p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>";
                    string p4 = @"<p>Thanks,</p><p>The HiPosTeam</p>";
                    string p2 = String.Format(@"Hi {0},<br /> {1} <p>Your single-use code is: <b>{2}</b></p> {3} {4}", user.FullName, p1, verifyCode.CodeVerify, p3, p4);
                    IEnumerable<string> lstEmail = new string[] { user.Email };
                    MessageModel messageModel = new MessageModel(lstEmail, "Confirm Code", p2);
                    _emailService.SendEmail(messageModel);
                    _donViRepository.CommitTransactionAsync();

                    return 1;
                }
                catch(Exception ex)
                {
                    _logger.LogError(ex, "AddDonViRequest");
                    _donViRepository.RollbackTransactionAsync();
                    return 0;
                }
            }
        }
    }
}
