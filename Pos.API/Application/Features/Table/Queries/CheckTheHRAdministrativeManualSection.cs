using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;
using static User.API.Application.Features.DanhMuc.Queries.GetDanhMucListQuery;
namespace Pos.API.Application.Features.Table.Queries
{
    public class CheckTheHRAdministrativeManualSection
    {
        public class CheckTheHRAdministrativeManual : IRequest<int[]>
        {
            public int DONVI { get; set; }
            public CheckTheHRAdministrativeManual(int id)
            {
                DONVI = id;
            }
        }

        public class Handler : IRequestHandler<CheckTheHRAdministrativeManual, int[]>
        {
            private readonly IBanRepository _banRepository;
            private readonly IMapper _mapper;

            public Handler(IBanRepository banRepository, IMapper mapper)
            {
                _banRepository = banRepository ?? throw new ArgumentNullException(nameof(banRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<int[]> Handle(CheckTheHRAdministrativeManual request, CancellationToken cancellationToken)
            {
                var arrResult = await _banRepository.CheckTheHRAdministrativeManual(request.DONVI);
                return arrResult;
            }
        }
    }
}
