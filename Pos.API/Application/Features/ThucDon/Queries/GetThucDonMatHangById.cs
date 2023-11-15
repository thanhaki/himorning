using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.ThucDon.Queries
{
    public class GetThucDonMHById
    {
        public class ThucDonMatHangByIdQuery : IRequest<List<MatHangModelRespose>>
        {
            public int Id { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<ThucDonMatHangByIdQuery, List<MatHangModelRespose>>
        {
            private readonly IThucDonRepository _ThucDonMhRepository;
            private readonly IMapper _mapper;

            public Handler(IThucDonRepository ThucDonMhRepository, IMapper mapper)
            {
                _ThucDonMhRepository = ThucDonMhRepository ?? throw new ArgumentNullException(nameof(ThucDonMhRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<MatHangModelRespose>> Handle(ThucDonMatHangByIdQuery request, CancellationToken cancellationToken)
             {
                var List = await _ThucDonMhRepository.GetAllThucDonMatHangById(request);
                return List.ToList();
            }
        }
    }
}