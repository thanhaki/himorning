using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.VaiTroNhanVien.Commands
{
    public class UpdateNhanVienCommand
    {
        public class UpdateNhanVienRequest : IRequest
        {
            public int No_User { get; set; }
            public int? DonVi { get; set; }
            public string UserName { get; set; }
            public string FullName { get; set; }
            public string? Password { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string? PIN { get; set; }
            public int Ma_NhomQuyen { get; set; }
            public bool? IsResetPw { get; set; }

        }

        public class Handler : IRequestHandler<UpdateNhanVienRequest>
        {
            private readonly INhanVienRepository _nhanVienRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateNhanVienCommand> _logger;
            public Handler(INhanVienRepository nhanVienRepository, IMapper mapper, ILogger<UpdateNhanVienCommand> logger)
            {
                _nhanVienRepository = nhanVienRepository ?? throw new ArgumentNullException(nameof(nhanVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateNhanVienRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _nhanVienRepository.BeginTransactionAsync();
                    Expression<Func<M_User, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.No_User == request.No_User;
                    var nhanVienById = await _nhanVienRepository.GetFirstOrDefaultAsync(fillter);
                    var oldPassword = nhanVienById?.Password;
                    if (request.IsResetPw == true)
                    {
                        nhanVienById.Password = Utilities.Encrypt(request.PIN);
                    }
                    else
                    {
                        _mapper.Map(request, nhanVienById);
                        nhanVienById.IsLock = 0;
                        nhanVienById.Role_Code = 0;
                        nhanVienById.FullName = request.FullName;
                        nhanVienById.Phone = request.Phone;
                        nhanVienById.PIN = request.PIN;
                        nhanVienById.Permistion = request.Ma_NhomQuyen;
                        nhanVienById.Password = oldPassword;
                    }
                    if (nhanVienById != null)
                    {
                        await _nhanVienRepository.UpdateAsync(nhanVienById);
                        _logger.LogInformation($"Nhan Vien {Unit.Value} is successfully updated.");
                    }
                    _nhanVienRepository.CommitTransactionAsync();
                    return Unit.Value;
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
