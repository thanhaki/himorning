using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.KhuyenMai.Queries
{
    public class GetListKhuyenMai
    {
        public class KhuyenMaiQuery : IRequest<List<KhuyenMaiModalResponse>>
        {
            public int DonVi { get; set; }
            public KhuyenMaiQuery(int id)
            {
                DonVi = id;
            }
        }
        public class Handler : IRequestHandler<KhuyenMaiQuery, List<KhuyenMaiModalResponse>>
        {
            private readonly IKhuyenMaiRepository _khuyenMaiRepository;
            private readonly IMapper _mapper;

            public Handler(IKhuyenMaiRepository khuyenMaiRepository, IMapper mapper)
            {
                _khuyenMaiRepository = khuyenMaiRepository ?? throw new ArgumentNullException(nameof(khuyenMaiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<KhuyenMaiModalResponse>> Handle(KhuyenMaiQuery request, CancellationToken cancellationToken)
            {
                var listKhuyenMai = await _khuyenMaiRepository.GetAllKhuyenMai(request.DonVi);
                return listKhuyenMai.ToList();

            }
        }
    }
}
