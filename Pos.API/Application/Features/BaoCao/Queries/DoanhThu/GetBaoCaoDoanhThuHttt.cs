using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Features.BaoCao.Queries.DoanhThu
{
    public class GetBaoCaoDoanhThuHTTT
    {
        public class HtttRq : IRequest<DoanhThuHTTTResponse>
        {
            public int? DonVi { get; set; }
            public string? ThoiGian { set; get; }
            public string? TuNgay { set; get; }
            public string? DenNgay { set; get; }
        }

        public class Handler : IRequestHandler<HtttRq, DoanhThuHTTTResponse>
        {
            private readonly IDonHangRepository _donHangRepository;

            public Handler(IDonHangRepository donHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<DoanhThuHTTTResponse> Handle(HtttRq request, CancellationToken cancellationToken)
            {
                var data = await _donHangRepository.GetBaoCaoDoanhThuHTTT(request.DonVi.Value, request.ThoiGian, request.TuNgay, request.DenNgay);
                return data;
            }
        }
    }
}
