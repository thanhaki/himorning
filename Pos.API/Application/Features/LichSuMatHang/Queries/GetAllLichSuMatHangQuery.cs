using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.LichSuMatHang.Queries
{
    public class GetAllLichSuMatHangQuery
    {
        public class LichSuMhQuery : IRequest<List<LichSuKhoModelResponse>>
        {
            public int DonVi { get; set; }
            public string? TenMH { get; set; }
            public string TuNgay { get; set; }
            public string DenNgay { get; set; }
        }
        public class Handler : IRequestHandler<LichSuMhQuery, List<LichSuKhoModelResponse>>
        {
            private readonly ILichSuDonHangRepository _lichSuMhRepository;
            private readonly IMapper _mapper;

            public Handler(ILichSuDonHangRepository lichSuMhRepository, IMapper mapper)
            {
                _lichSuMhRepository = lichSuMhRepository ?? throw new ArgumentNullException(nameof(lichSuMhRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<LichSuKhoModelResponse>> Handle(LichSuMhQuery request, CancellationToken cancellationToken)
            {
                var danhSachLs = await _lichSuMhRepository.GetAllLichSuMh(request.DonVi, request.TenMH, request.TuNgay, request.DenNgay);
                return danhSachLs.ToList();
            }
        }
    }
}
