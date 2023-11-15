using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.PhieuNhapXuat.Queries
{
    public class GetListLoaiPhieuNhapXuatQueries
    {
        public class LoaiPhieuNXQuery : IRequest<List<PhieuNhapXuatModelResponse>>
        {
            public int DonVi { get; set; }
            public string? MaPhieu { get; set; }
            public string TuNgay { get; set; }
            public string DenNgay { get; set; }
            public string Type { get; set; }
            
        }
        public class Handler : IRequestHandler<LoaiPhieuNXQuery, List<PhieuNhapXuatModelResponse>>
        {
            private readonly IPhieuNhapXuatRepository _phieuXuatNhapRepository;
            private readonly IMapper _mapper;

            public Handler(IPhieuNhapXuatRepository phieuXuatNhapRepository, IMapper mapper)
            {
                _phieuXuatNhapRepository = phieuXuatNhapRepository ?? throw new ArgumentNullException(nameof(phieuXuatNhapRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<PhieuNhapXuatModelResponse>> Handle(LoaiPhieuNXQuery request, CancellationToken cancellationToken)
            {
                var danhSachPhieu = await _phieuXuatNhapRepository.GetAllPhieuNhapXuat(request);
                return danhSachPhieu.ToList();
            }
        }
    }
}
