using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.ThucDonMatHang.Queries
{
    public class GetThucDonMatHangByIdMh
    {
        public class ThucDonMHByIdQuery : IRequest<IEnumerable<ThucDonModelResponse>>
        {
            public int DonVi { get; set; }
            public int Ma_MH { get; set; }

            public ThucDonMHByIdQuery(int dv, int ma_MH)
            {
                DonVi = dv;
                Ma_MH = ma_MH;
            }
        }

        public class Handler : IRequestHandler<ThucDonMHByIdQuery, IEnumerable<ThucDonModelResponse>>
        {
            private readonly IThucDonMatHangRepository _thucDonMHRepository;
            private readonly IMapper _mapper;

            public Handler(IThucDonMatHangRepository thucDonMHRepository, IMapper mapper)
            {
                _thucDonMHRepository = thucDonMHRepository ?? throw new ArgumentNullException(nameof(thucDonMHRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<IEnumerable<ThucDonModelResponse>> Handle(ThucDonMHByIdQuery request, CancellationToken cancellationToken)
            {
                var List = await _thucDonMHRepository.GetThucDonMHById(request.DonVi,request.Ma_MH);
                return List;
            }
        }
    }
}
