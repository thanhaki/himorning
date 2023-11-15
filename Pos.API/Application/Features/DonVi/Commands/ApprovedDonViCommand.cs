using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace User.API.Application.Features.DonVi.Commands
{
    public class ApprovedDonViCommand
    {
        public class ApprovedDonViRequest : IRequest<int>
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<ApprovedDonViRequest, int>
        {
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            public Handler(IDonViRepository donViRepository, IMapper mapper)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<int> Handle(ApprovedDonViRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DonVi, bool>> filterDV = dv => dv.DonVi == request.Id && dv.Deleted == 0;
                var dv = await _donViRepository.GetFirstOrDefaultAsync(filterDV);

                if (dv != null)
                {
                    dv.Approved = 1;
                    await _donViRepository.UpdateAsync(dv);
                    return 1;
                }
                return 0;
            }
        }
    }
}
