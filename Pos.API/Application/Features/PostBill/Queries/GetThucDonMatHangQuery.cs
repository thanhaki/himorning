using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.PostBill.Queries
{
    public class GetThucDonMatHangQueryByDonVi
    {
        public class GetThucDonRequest : IRequest<List<ThucDonModelResponse>>
        {
            public int DonVi { get; set; }

            public GetThucDonRequest(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<GetThucDonRequest, List<ThucDonModelResponse>>
        {
            private readonly IThucDonMatHangRepository _ThucDonMHRepository;
            private readonly IMapper _mapper;

            public Handler(IThucDonMatHangRepository ThucDonMHRepository, IMapper mapper)
            {
                _ThucDonMHRepository = ThucDonMHRepository ?? throw new ArgumentNullException(nameof(ThucDonMHRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<ThucDonModelResponse>> Handle(GetThucDonRequest request, CancellationToken cancellationToken)
            {
                var result = await _ThucDonMHRepository.GetTDMatHangByDonVi(request.DonVi);
                return result.ToList();
            }
        }
    }
}
