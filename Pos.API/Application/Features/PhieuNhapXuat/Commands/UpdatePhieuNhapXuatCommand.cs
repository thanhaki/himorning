using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PhieuNhapXuat.Commands
{
    public class UpdatePhieuNhapXuatCommand
    {
        public class UpdatePhieuNXRequest : IRequest
        {
            public int[] ids { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdatePhieuNXRequest>
        {
            private readonly IPhieuNhapXuatRepository _phieuXuatNhapRepository;
            private readonly ILichSuDonHangRepository _lichSuDonHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdatePhieuNhapXuatCommand> _logger;
            public Handler(IPhieuNhapXuatRepository phieuXuatNhapRepository, ILichSuDonHangRepository lichSuDonHangRepository, IMapper mapper, ILogger<UpdatePhieuNhapXuatCommand> logger)
            {
                _phieuXuatNhapRepository = phieuXuatNhapRepository ?? throw new ArgumentNullException(nameof(phieuXuatNhapRepository));
                _lichSuDonHangRepository = lichSuDonHangRepository ?? throw new ArgumentNullException(nameof(lichSuDonHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdatePhieuNXRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<T_PhieuNhapXuat, bool>> getPhieuNx = x => x.DonVi == request.DonVi && x.Deleted == 0 && request.ids.Contains(x.Ma_PNX);
                var getPhieuById = await _phieuXuatNhapRepository.GetFirstOrDefaultAsync(getPhieuNx);

                //hủy phiếu => update huy
                if (getPhieuById != null)
                {
                    _mapper.Map(request, getPhieuById);
                    getPhieuById.TinhTrang_Phieu = 3;
                    await _phieuXuatNhapRepository.UpdateAsync(getPhieuById);
                    _logger.LogInformation($"Phieu nhap xuat {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
