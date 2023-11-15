using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;
using static User.API.Application.Features.DanhMuc.Queries.GetDanhMucListQuery;

namespace Pos.API.Application.Features.Table.Queries
{
    public class CheckTheSalesGuideSection
    {
        public class CheckTheSalesGuide : IRequest<int[]>
        {
            public int DONVI { get; set; }
            public CheckTheSalesGuide(int id)
            {
                DONVI = id;
            }
        }

        public class Handler : IRequestHandler<CheckTheSalesGuide, int[]>
        {
            private readonly IBanRepository _banRepository;
            private readonly IMapper _mapper;

            public Handler(IBanRepository banRepository, IMapper mapper)
            {
                _banRepository = banRepository ?? throw new ArgumentNullException(nameof(banRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<int[]> Handle(CheckTheSalesGuide request, CancellationToken cancellationToken)
            {
                var arrResult = await _banRepository.CheckTheSalesGuideSection(request.DONVI);
                return arrResult;
            }
        }
    }
}
