using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;
using static User.API.Application.Features.DanhMuc.Queries.GetDanhMucListQuery;

namespace Pos.API.Application.Features.Table.Queries
{
    public class GetTotalNumberOfTables
    {
        public class GetTotalNumberQuery : IRequest<int[]>
        {
            public int DONVI { get; set; }
            public GetTotalNumberQuery(int id)
            {
                DONVI = id;
            }
        }

        public class Handler : IRequestHandler<GetTotalNumberQuery, int[]>
        {
            private readonly IBanRepository _banRepository;
            private readonly IMapper _mapper;

            public Handler(IBanRepository banRepository, IMapper mapper)
            {
                _banRepository = banRepository ?? throw new ArgumentNullException(nameof(banRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<int[]> Handle(GetTotalNumberQuery request, CancellationToken cancellationToken)
            {
                var arrResult = await _banRepository.CheckTheSalesGuideSection(request.DONVI);
                return arrResult;
            }
        }
    }
}
