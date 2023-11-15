using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using static Pos.API.Application.Features.Outlet.Commands.AddTableToOutletCommand;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Application.Features.Table.Commands
{
    public class UpdateTableCommand
    {
        public class UpdateTblRequest : IRequest<int>
        {
            [Required]
            public int MaOutlet { get; set; }
            [Required]
            public int DonVi { get; set; }
            [Required]
            public ItemTable Table { get; set; }
        }
        public class Handler : IRequestHandler<UpdateTblRequest, int>
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

            public async Task<int> Handle(UpdateTblRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Outlet, bool>> predicate = o => o.Ma_Outlet == request.MaOutlet && o.DonVi == request.DonVi && o.Deleted == 0;
                var outlets = await _outletRepository.GetFirstOrDefaultAsync(predicate);
                if (outlets == null) { return -1; }

                // Create new table
                if (request.Table.IsAddNew)
                {
                    Func<IQueryable<M_Ban>, IOrderedQueryable<M_Ban>> orderTbs = x => x.OrderByDescending(X => X.Ma_Ban);
                    var tblMax = await _banRepository.GetMaxIdAsync(orderTbs);
                    int idTbl = tblMax == null ? 1 : tblMax.Ma_Ban + 1;
                    M_Ban b = new M_Ban();
                    b.Ma_Ban = idTbl;
                    b.Ma_Outlet = request.MaOutlet;
                    b.X = request.Table.X;
                    b.Y = request.Table.Y;
                    b.Ten_Ban = b.Ma_Ban.ToString();
                    b.MieuTa_Ban = request.Table.MieuTaBan;
                    b.DonVi = request.DonVi;

                    await _banRepository.AddAsync(b);
                } 
                else
                {
                    // Update old table
                    Expression<Func<M_Ban, bool>> filterBan = o => o.Ma_Outlet == request.MaOutlet && o.DonVi == request.DonVi && o.Ma_Ban == request.Table.Id;
                    var tbl = await _banRepository.GetFirstOrDefaultAsync(filterBan);
                    if (tbl == null) { return 0; }

                    tbl.X = request.Table.X;
                    tbl.Y = request.Table.Y;
                    tbl.MieuTa_Ban = request.Table.MieuTaBan;

                    await _banRepository.UpdateAsync(tbl);
                }

                return 1;
            }

        }
    }
}
