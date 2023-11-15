using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Features.BaoCao.Queries.DoanhThu
{
    public class GetBaoCaoDoanhThuTongQuan
    {
        public class TongQuanRq : IRequest<DoanhThuTongQuanResponse>
        {
            public int? DonVi { get; set; }
            public string? ThoiGian { set; get; }
            public string? TuNgay { set; get; }
            public string? DenNgay { set; get; }
        }

        public class Handler : IRequestHandler<TongQuanRq, DoanhThuTongQuanResponse>
        {
            private readonly IDonHangRepository _donHangRepository;

            public Handler(IDonHangRepository donHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<DoanhThuTongQuanResponse> Handle(TongQuanRq request, CancellationToken cancellationToken)
            {
                var data = await _donHangRepository.GetBaoCaoDoanhThuTongQuan(request.DonVi.Value, request.ThoiGian, request.TuNgay, request.DenNgay);
                return data;
            }
        }
    }
}
