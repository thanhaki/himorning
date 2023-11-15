using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Table.Commands
{
    public class DeleteTableCommand
    {
        public class DeleteTblRequest : IRequest<int>
        {
            [Required]
            public int Id { get; set; }
            [Required]
            public int MaOutlet { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<DeleteTblRequest, int>
        {
            private readonly IOutletRepository _outletRepository;
            private readonly IBanRepository _banRepository;
            private readonly IMapper _mapper;

            public Handler(
                IMapper mapper,
                IOutletRepository outletRepository,
                IBanRepository banRepository)
            {
                _outletRepository = outletRepository ?? throw new ArgumentNullException(nameof(outletRepository));
                _banRepository = banRepository ?? throw new ArgumentNullException(nameof(banRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<int> Handle(DeleteTblRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Outlet, bool>> predicate = o => o.Ma_Outlet == request.MaOutlet && o.DonVi == request.DonVi && o.Deleted == 0;
                var outlets = await _outletRepository.GetFirstOrDefaultAsync(predicate);
                if (outlets == null) { return -1; }

                Expression<Func<M_Ban, bool>> filterBan = o => o.Ma_Outlet == request.MaOutlet && o.DonVi == request.DonVi && o.Ma_Ban == request.Id;
                var tbl = await _banRepository.GetFirstOrDefaultAsync(filterBan);

                if (tbl == null) { return 0; }

                tbl.Deleted = 1;

                await _banRepository.UpdateAsync(tbl);
                return 1;
            }

        }
    }
}
