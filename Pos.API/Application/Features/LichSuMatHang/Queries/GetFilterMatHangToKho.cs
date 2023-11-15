using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.LichSuMatHang.Queries
{
    public class GetFilterMatHangToKho
    {
        public class FilterMhKhoQuery : IRequest<List<TonKhoModelResponse>>
        {
            public int DonVi { get; set; }
            public string? TenMH { get; set; }
        }
        public class Handler : IRequestHandler<FilterMhKhoQuery, List<TonKhoModelResponse>>
        {
            private readonly ILichSuDonHangRepository _lichSuMhRepository;
            private readonly IMapper _mapper;

            public Handler(ILichSuDonHangRepository lichSuMhRepository, IMapper mapper)
            {
                _lichSuMhRepository = lichSuMhRepository ?? throw new ArgumentNullException(nameof(lichSuMhRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<TonKhoModelResponse>> Handle(FilterMhKhoQuery request, CancellationToken cancellationToken)
            {
                var list = await _lichSuMhRepository.GetDsFilterMh(request.DonVi, request.TenMH);
                return list.ToList();
            }
        }
    }
}
