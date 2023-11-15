using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Features.BaoCao.Queries.MatHang
{
    public class GetBaoCaoLoiNhuanMatHang
    {
        public class LoiNhuanRq : IRequest<IEnumerable<LoiNhuanTheoMHResponse>>
        {
            public int? DonVi { get; set; }
            public string? ThoiGian { set; get; }
            public string? TuNgay { set; get; }
            public string? DenNgay { set; get; }
        }

        public class Handler : IRequestHandler<LoiNhuanRq, IEnumerable<LoiNhuanTheoMHResponse>>
        {
            private readonly IDonHangRepository _donHangRepository;

            public Handler(IDonHangRepository donHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<IEnumerable<LoiNhuanTheoMHResponse>> Handle(LoiNhuanRq request, CancellationToken cancellationToken)
            {
                var data = await _donHangRepository.GetBaoCaoLoiNhuanTheoMH(request.DonVi.Value, request.ThoiGian, request.TuNgay, request.DenNgay);
                return data;
            }
        }
    }
}
