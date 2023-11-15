using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Application.Features.Outlet.Commands
{
    public class AddOutletCommand
    {
        public class AddOutletRequest : IRequest<int>
        {
            public string Ten_Outlet { get; set; }
            public string GhiChu { get; set; }
            public int SoLuongBan { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddOutletRequest, int>
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
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _banRepository = banRepository ?? throw new ArgumentNullException(nameof(banRepository));
            }

            public async Task<int> Handle(AddOutletRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _outletRepository.BeginTransactionAsync();
                    // Check name
                    Expression<Func<M_Outlet, bool>> predicate = o => o.Ten_Outlet.ToLower().Equals(request.Ten_Outlet.ToLower()) && o.DonVi == request.DonVi && o.Deleted == 0;
                    var outletExist = await _outletRepository.GetFirstOrDefaultAsync(predicate);
                    if (outletExist != null) { return -1; }

                    Func<IQueryable<M_Outlet>, IOrderedQueryable<M_Outlet>> orderingFunc = x => x.OrderByDescending(X => X.Ma_Outlet);
                    var outletMax = await _outletRepository.GetMaxIdAsync(orderingFunc);
                    int idOutlet = outletMax == null ? 1 : outletMax.Ma_Outlet + 1;

                    var outlet = _mapper.Map<M_Outlet>(request);
                    outlet.Ma_Outlet = idOutlet;
                    List<M_Ban> lstTbl = new List<M_Ban>();
                    
                    Func<IQueryable<M_Ban>, IOrderedQueryable<M_Ban>> orderTbs = x => x.OrderByDescending(X => X.Ma_Ban);
                    var tblMax = await _banRepository.GetMaxIdAsync(orderTbs);
                    int idTbl = tblMax == null ? 1 : tblMax.Ma_Ban + 1;

                    Expression<Func<M_Ban, bool>> filterTbl = b => b.DonVi == request.DonVi && b.Deleted == 0;
                    Func<IQueryable<M_Ban>, IOrderedQueryable<M_Ban>> orderTenBan = x => x.OrderByDescending(X => X.Ten_Ban);
                    var tentblMax = await _banRepository.GetAsync(filterTbl, orderTenBan);
                    int idex = 1;
                    if (tentblMax.Count > 0)
                    {
                        var maxValue = tentblMax.Max(x => int.Parse(x.Ten_Ban));

                        var t = tentblMax.FirstOrDefault();
                        idex = maxValue + 1;
                    }

                    for (int i = 0; i < outlet.SoLuongBan; i++)
                    {
                        M_Ban b = new M_Ban();
                        b.Ma_Ban = idTbl + i;
                        b.Ma_Outlet = outlet.Ma_Outlet;
                        b.X = (decimal)POSITION_DEFAULT.X;
                        b.Y = (decimal)POSITION_DEFAULT.Y;
                        b.Ten_Ban = (idex + i).ToString();
                        b.DonVi = outlet.DonVi;
                        lstTbl.Add(b);
                    }
                    await _banRepository.AddRangeAsync(lstTbl);
                    await _outletRepository.AddAsync(outlet);
                    _outletRepository.CommitTransactionAsync();
                    return 1;
                }
                catch(Exception ex)
                {
                    _outletRepository.RollbackTransactionAsync();
                    return 0;
                }
            }

        }
    }
}
