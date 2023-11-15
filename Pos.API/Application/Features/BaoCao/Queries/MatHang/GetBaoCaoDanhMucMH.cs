using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Features.BaoCao.Queries.MatHang
{
    public class GetBaoCaoDanhMuc
    {
        public class DanhMucRq : IRequest<DanhMucMatHangResponse>
        {
            public int? DonVi { get; set; }
            public string? ThoiGian { set; get; }
            public string? TuNgay { set; get; }
            public string? DenNgay { set; get; }
        }

        public class Handler : IRequestHandler<DanhMucRq, DanhMucMatHangResponse>
        {
            private readonly IDonHangRepository _donHangRepository;

            public Handler(IDonHangRepository donHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<DanhMucMatHangResponse> Handle(DanhMucRq request, CancellationToken cancellationToken)
            {
                var data = await _donHangRepository.GetBaoCaoDanhMucMH(request.DonVi.Value, request.ThoiGian, request.TuNgay, request.DenNgay);
                return data;
            }
        }
    }
}
