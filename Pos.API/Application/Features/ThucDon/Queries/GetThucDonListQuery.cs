using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Features.DonViMatHang.Queries
{
    public class GetThucDonListQuery
    {
        public class GetThucDonQuery : IRequest<List<ThucDonModelResponse>>
        {
            public int DonVi { get; set; }

            public GetThucDonQuery(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<GetThucDonQuery, List<ThucDonModelResponse>>
        {
            private readonly IThucDonRepository _ThucDonRepository;
            private readonly IMapper _mapper;

            public Handler(IThucDonRepository ThucDonRepository, IMapper mapper)
            {
                _ThucDonRepository = ThucDonRepository ?? throw new ArgumentNullException(nameof(ThucDonRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<ThucDonModelResponse>> Handle(GetThucDonQuery request, CancellationToken cancellationToken)
            {
                var List = await _ThucDonRepository.GetAllThucDon(request);
                return List.ToList();
            }
        }
    }
}
