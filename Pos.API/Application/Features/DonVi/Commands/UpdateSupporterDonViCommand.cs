using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;
using static Pos.API.Constans.CmContext;

namespace User.API.Application.Features.DonVi.Commands
{
    public class UpdateSupporterDonViCommand
    {
        public class UpdateSupporterDVRequest : IRequest<int>
        {
            public int Id { get; set; }
            public int Supporter { get; set; }
        }

        public class Handler : IRequestHandler<UpdateSupporterDVRequest, int>
        {
            private readonly IDonViRepository _donViRepository;

            public Handler(
                IDonViRepository donViRepository)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }

            public async Task<int> Handle(UpdateSupporterDVRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DonVi, bool>> dv = d => d.DonVi == request.Id && d.Deleted == 0;
                var donvi = await _donViRepository.GetFirstOrDefaultAsync(dv);
                if (donvi != null)
                {
                    donvi.Supporter = request.Supporter;
                    await _donViRepository.UpdateAsync(donvi);
                    return 1;
                }
                return 0;
            }
        }
    }
}
