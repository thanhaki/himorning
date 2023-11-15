using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PhieuThuChi.Commands
{
    public class UpdatePhieuThuChiCommand
    {
        public class UpdatePhieuThuChiRequest : IRequest<int>
        {
            public int So_PhieuThuChi { set; get; }
            public int Loai_PhieuThuChi { get; set; }
            public int MaDanhMucThuChi { get; set; }
            public DateTime? NgayLapPhieu { get; set; }
            public string? ThoiGianGhiNhan { get; set; }
            public int MaNhomDoiTuong { get; set; }
            public int MaDoiTuong { get; set; }
            public decimal GiaTriThuChi { get; set; }
            public int? HoachToanKinhDoanh { get; set; }
            public int SoHinhThucThanhToan { get; set; }
            public string? NoiDung { get; set; }
            public string? FileThuChi { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdatePhieuThuChiRequest, int>
        {
            private readonly IPhieuThuChiRepository _phieuThuChiRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddPhieuThuChiCommand> _logger;

            public Handler(IPhieuThuChiRepository phieuThuChiRepository, IMapper mapper, ILogger<AddPhieuThuChiCommand> logger, IDonViRepository donViRepository)
            {
                _phieuThuChiRepository = phieuThuChiRepository ?? throw new ArgumentNullException(nameof(phieuThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(UpdatePhieuThuChiRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<T_PhieuThuChi, bool>> getTC = x => x.So_PhieuThuChi == request.So_PhieuThuChi && x.DonVi == request.DonVi && x.Deleted == 0;
                var t_ThuChi = await _phieuThuChiRepository.GetFirstOrDefaultAsync(getTC);
                if (t_ThuChi != null)
                {
                    _mapper.Map(request, t_ThuChi);
                    await _phieuThuChiRepository.UpdateAsync(t_ThuChi);
                    _logger.LogInformation($"Phieu Thu Chi {Unit.Value} is successfully updated.");
                    return 1;
                }
                return 0;
            }
        }
    }
}
