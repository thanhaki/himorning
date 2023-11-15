using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.KhuyenMai.Queries
{
    public class GetListTimeByIdKhuyenMai
    {
        public class TimeKhuyenMaiQuery : IRequest<List<KhuyenMaiModalResponse>>
        {
            public int DonVi { get; set; }
            public int SoKhuyenMai { get; set; }
        }
        public class Handler : IRequestHandler<TimeKhuyenMaiQuery, List<KhuyenMaiModalResponse>>
        {
            private readonly IKhuyenMaiKTGRepository _tiemKhuyenMaiRepository;
            private readonly IMapper _mapper;

            public Handler(IKhuyenMaiKTGRepository tiemKhuyenMaiRepository, IMapper mapper)
            {
                _tiemKhuyenMaiRepository = tiemKhuyenMaiRepository ?? throw new ArgumentNullException(nameof(tiemKhuyenMaiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<KhuyenMaiModalResponse>> Handle(TimeKhuyenMaiQuery request, CancellationToken cancellationToken)
            {
                var listTime = await _tiemKhuyenMaiRepository.GetListTimeKhuyenMaiBydId(request);
                return listTime.ToList();

            }
        }
    }
}
