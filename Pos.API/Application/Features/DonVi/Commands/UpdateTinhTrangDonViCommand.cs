using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace User.API.Application.Features.DonVi.Commands
{
    public class UpdateTinhTrangDonViCommand
    {
        public class UpdateTinhTrangRequest : IRequest<int>
        {
            public int Id { get; set; }
            public int TinhTrang { get; set; }
        }

        public class Handler : IRequestHandler<UpdateTinhTrangRequest, int>
        {
            private readonly IDonViRepository _donViRepository;

            private readonly IMapper _mapper;
            public Handler(
                IDonViRepository donViRepository)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }

            public async Task<int> Handle(UpdateTinhTrangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DonVi, bool>> dv = d => d.DonVi == request.Id && d.Deleted == 0;
                var donvi = await _donViRepository.GetFirstOrDefaultAsync(dv);
                if (donvi != null)
                {
                    donvi.TinhTrang = request.TinhTrang;
                    await _donViRepository.UpdateAsync(donvi);
                    return 1;
                }
                return 0;
            }
        }
    }
}
