using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Linq.Expressions;
using static Pos.API.Application.Features.DonViMatHang.Commands.DeleteDonViMatHangCommand;

namespace Pos.API.Application.Features.NhanVien.Commands
{
    public class DeleteNhanVienCommand
    {
        public class DeleteNhanVienRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<DeleteNhanVienRequest>
        {
            private readonly INhanVienRepository _nhanVienRepository;
            private readonly ILogger<DeleteNhanVienCommand> _logger;
            public Handler(INhanVienRepository nhanVienRepository, ILogger<DeleteNhanVienCommand> logger)
            {
                _nhanVienRepository = nhanVienRepository ?? throw new ArgumentNullException(nameof(nhanVienRepository));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(DeleteNhanVienRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_User, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.No_User);
                    var listNv = await _nhanVienRepository.GetAsync(getByid);
                    listNv.ToList().ForEach(item => item.Deleted = 1);
                    await _nhanVienRepository.UpdateRangeAsync(listNv.ToList());
					_logger.LogInformation($"Nhan Vien {Unit.Value} is successfully deleted.");
                    return Unit.Value;
                }
                catch (Exception ex)
                {
                    throw;
                }

            }
        }
    }
}
