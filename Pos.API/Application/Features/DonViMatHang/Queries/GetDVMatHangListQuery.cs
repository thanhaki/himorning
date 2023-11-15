using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Features.DonViMatHang.Queries
{
    public class GetDVMatHangListQuery
    {
        public class Query : IRequest<IEnumerable<DonViMatHangModelRespose>>
        {
            public int DonVi { get; set; }

            public Query(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<Query, IEnumerable<DonViMatHangModelRespose>>
        {
            private readonly IDonViMathangRepository _DonViMatHangRepository;
            private readonly IMapper _mapper;

            public Handler(IDonViMathangRepository DonViMatHangRepository, IMapper mapper)
            {
                _DonViMatHangRepository = DonViMatHangRepository ?? throw new ArgumentNullException(nameof(DonViMatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<IEnumerable<DonViMatHangModelRespose>> Handle(Query request, CancellationToken cancellationToken)
            {
                var List = await _DonViMatHangRepository.GetAllDonViMatHang(request.DonVi);
                return List;
            }
        }
    }
}
