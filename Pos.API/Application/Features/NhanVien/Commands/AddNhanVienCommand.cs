using AutoMapper;
using MediatR;
using Pos.API.Application.Features.VaiTroNhanVien.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using static Pos.API.Application.Features.VaiTroNhanVien.Commands.AddNhomQuyenCommand;
using System.Linq.Expressions;
using System.Security;
using Pos.API.Constans;
using Pos.API.Common;

namespace Pos.API.Application.Features.NhanVien.Commands
{
    public class AddNhanVienCommand
    {
        public class AddNhanVienRequest : IRequest<int>
        {
            public string UserName { get; set; }
            public string Password { get; set; }
            public string FullName { get; set; }
            public string Phone { get; set; }
            public string Email { get; set; }
            public int? Ma_NhomQuyen { get; set; }
            public string PIN { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddNhanVienRequest, int>
        {
            private readonly IUserRepository _nhanVienRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddNhomQuyenCommand> _logger;
            public Handler(IUserRepository nhanVienRepository, IMapper mapper, ILogger<AddNhomQuyenCommand> logger)
            {
                _nhanVienRepository = nhanVienRepository ?? throw new ArgumentNullException(nameof(nhanVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(AddNhanVienRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _nhanVienRepository.BeginTransactionAsync();
                    var nhanVien = _mapper.Map<M_User>(request);
                    if (nhanVien != null)
                    {
                        Func<IQueryable<M_User>, IOrderedQueryable<M_User>> orderingFunc = x => x.OrderByDescending(X => X.No_User);
                        Expression<Func<M_User, bool>> fillter = u => u.UserName.ToLower() == request.UserName.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var checkNv= await _nhanVienRepository.GetFirstOrDefaultAsync(fillter);
                        if (checkNv != null)
                        {
                            _nhanVienRepository.CommitTransactionAsync();
                            return -1;
                        }
                        var maxId = await _nhanVienRepository.GetMaxIdAsync(orderingFunc);
                        nhanVien.No_User = maxId == null ? 1 : maxId.No_User + 1;
                        nhanVien.IsLock = 0;
                        nhanVien.Role_Code = 0;
                        nhanVien.IsAdministrator = "0";
                        nhanVien.Permistion = request.Ma_NhomQuyen;
                        nhanVien.Password = Utilities.Encrypt(request.Password);
                        
                        await _nhanVienRepository.AddAsync(nhanVien);
                        _logger.LogInformation($"Nhan Vien {Unit.Value} is successfully created.");
                    }
                    _nhanVienRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception)
                {
                    _nhanVienRepository.RollbackTransactionAsync();
                    throw;
                }

            }
        }
    }
}
