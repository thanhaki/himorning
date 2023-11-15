using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.VerifyCode.Commands
{
    public class UpdateVerifyCodeCommand
    {
        public class AddCodeRequest : IRequest<int>
        {
            public string? Email { get; set; }
        }
        public class Handler : IRequestHandler<AddCodeRequest, int>
        {
            private readonly IVerifyCodeRepository _verifyCodeRepository;
            private readonly IUserRepository _userRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateVerifyCodeCommand> _logger;
            private readonly IEmailService _emailService;

            public Handler(
                IVerifyCodeRepository verifyCodeRepository,
                IMapper mapper, 
                ILogger<UpdateVerifyCodeCommand> logger,
                IUserRepository userRepository,
                IEmailService emailService)
            {
                _verifyCodeRepository = verifyCodeRepository ?? throw new ArgumentNullException(nameof(verifyCodeRepository));
                _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _emailService = emailService;
            }

            public async Task<int> Handle(AddCodeRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_User, bool>> predicate = u => u.Email == request.Email && u.Deleted == 0;
                var user = await _userRepository.GetFirstOrDefaultAsync(predicate);

                if (user == null)
                    return 0;

                var verifyCode = new T_VerifyCode();
                verifyCode.DonVi = user.DonVi;
                verifyCode.CodeVerify = Utilities.RandomString(6);
                await _verifyCodeRepository.AddAsync(verifyCode);


                string p1 = @"<p>We have received your request to recover your password on the Hi POS system.</p>";
                string p2 = String.Format(@"Hi {0},<br /> {1} <p>Your verification code is: <b>{2}</b></p>", user.FullName, p1, verifyCode.CodeVerify);

                IEnumerable<string> lstEmail = new string[] { user.Email };
                MessageModel messageModel = new MessageModel(lstEmail, "Code Confirm To Recovery Password", p2);
                _emailService.SendEmail(messageModel);

                _logger.LogInformation($"New code is successfully created.");
                return 1;
            }

        }
    }
}
