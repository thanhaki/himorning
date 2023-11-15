using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.ThucDonMatHang.Queries
{
    public class GetThucDonMatHangQuery
    {
        public class GetThucDonMHQuery : IRequest<List<ThucDonMatHangModelResponse>>
        {
            public int DonVi { get; set; }

            public GetThucDonMHQuery(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<GetThucDonMHQuery, List<ThucDonMatHangModelResponse>>
        {
            private readonly IThucDonMatHangRepository _ThucDonMHRepository;
            private readonly IMapper _mapper;

            public Handler(IThucDonMatHangRepository ThucDonMHRepository, IMapper mapper)
            {
                _ThucDonMHRepository = ThucDonMHRepository ?? throw new ArgumentNullException(nameof(ThucDonMHRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<ThucDonMatHangModelResponse>> Handle(GetThucDonMHQuery request, CancellationToken cancellationToken)
            {
                var List = await _ThucDonMHRepository.GetAllThucDonMatHang(request);
                return List.ToList();
            }
        }
    }
}
