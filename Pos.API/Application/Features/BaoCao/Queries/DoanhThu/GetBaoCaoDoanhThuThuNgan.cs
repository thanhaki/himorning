using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Features.BaoCao.Queries.DoanhThu
{
    public class GetBaoCaoDoanhThuThuNgan
    {
        public class ThuNganRq : IRequest<DoanhThuThuNganResponse>
        {
            public int? DonVi { get; set; }
            public string? ThoiGian { set; get; }
            public string? TuNgay { set; get; }
            public string? DenNgay { set; get; }
        }

        public class Handler : IRequestHandler<ThuNganRq, DoanhThuThuNganResponse>
        {
            private readonly IDonHangRepository _donHangRepository;

            public Handler(IDonHangRepository donHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<DoanhThuThuNganResponse> Handle(ThuNganRq request, CancellationToken cancellationToken)
            {
                var data = await _donHangRepository.GetBaoCaoDoanhThuNgan(request.DonVi.Value, request.ThoiGian, request.TuNgay, request.DenNgay);
                return data;
            }
        }
    }
}
