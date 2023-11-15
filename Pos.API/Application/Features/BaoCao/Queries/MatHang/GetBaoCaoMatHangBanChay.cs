using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Features.BaoCao.Queries.MatHang
{
    public class GetBaoCaoMatHangBanChay
    {
        public class MHBanChayRq : IRequest<MatHangBanChayResponse>
        {
            public int? DonVi { get; set; }
            public string? ThoiGian { set; get; }
            public string? TuNgay { set; get; }
            public string? DenNgay { set; get; }
        }

        public class Handler : IRequestHandler<MHBanChayRq, MatHangBanChayResponse>
        {
            private readonly IDonHangRepository _donHangRepository;

            public Handler(IDonHangRepository donHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<MatHangBanChayResponse> Handle(MHBanChayRq request, CancellationToken cancellationToken)
            {
                var data = await _donHangRepository.GetBaoCaoMHBanChay(request.DonVi.Value, request.ThoiGian, request.TuNgay, request.DenNgay);
                return data;
            }
        }
    }
}
