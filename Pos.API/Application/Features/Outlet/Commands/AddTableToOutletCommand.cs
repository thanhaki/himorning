using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Outlet.Commands
{
    public class AddTableToOutletCommand
    {
        public class ItemTable
        {
            public int Id { get; set; }
            public decimal X { get; set; }
            public decimal Y { get; set; }
            public bool IsAddNew { get; set; }
            public string? MieuTaBan { get; set; }
        }
        public class AddTableRequest : IRequest<int>
        {
            public int MaOutlet { get; set; }
            public string TenOutlet { get; set; }

            public int DonVi { get; set; }

            public List<ItemTable> Tables { get; set; }
        }
        public class Handler : IRequestHandler<AddTableRequest, int>
        {
            private readonly IOutletRepository _outletRepository;
            private readonly IBanRepository _banRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddTableToOutletCommand> _logger;

            public Handler(
                IMapper mapper, 
                IOutletRepository outletRepository, 
                IBanRepository banRepository,
                ILogger<AddTableToOutletCommand> logger)
            {
                _outletRepository = outletRepository ?? throw new ArgumentNullException(nameof(outletRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _banRepository = banRepository ?? throw new ArgumentNullException(nameof(banRepository));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(AddTableRequest request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("Start AddTableToOutletCommand");
                try
                {
                    _outletRepository.BeginTransactionAsync();
                    // Check name
                    Expression<Func<M_Outlet, bool>> predicate = o => o.DonVi == request.DonVi && o.Deleted == 0 && o.Ma_Outlet == request.MaOutlet;
                    var outletExist = await _outletRepository.GetFirstOrDefaultAsync(predicate);
                    if (outletExist != null) 
                    {
                        _logger.LogInformation("Start update name outlet");
                        outletExist.Ten_Outlet = request.TenOutlet;
                        outletExist.SoLuongBan = request.Tables.Count;
                    }
                    else
                    {
                        _logger.LogError($"Outlet {request.MaOutlet} not exists");
                        _outletRepository.CommitTransactionAsync();
                        return -1;
                    }

                    var listBan = new List<M_Ban>();
                    Func<IQueryable<M_Ban>, IOrderedQueryable<M_Ban>> orderTbs = x => x.OrderByDescending(X => X.Ma_Ban);
                    var tblMax = await _banRepository.GetMaxIdAsync(orderTbs);
                    int idTbl = tblMax == null ? 1 : tblMax.Ma_Ban;

                    Expression<Func<M_Ban, bool>> filterTbl = b => b.DonVi == request.DonVi && b.Deleted == 0;
                    Func<IQueryable<M_Ban>, IOrderedQueryable<M_Ban>> orderTenBan = x => x.OrderByDescending(X => X.Ten_Ban);
                    var tentblMax = await _banRepository.GetAsync(filterTbl, orderTenBan);
                    int idex = 1;
                    if (tentblMax.Count > 0)
                    {
                        var t = tentblMax.Max(x=> int.Parse(x.Ten_Ban));
                        idex = t + 1;
                    }

                    foreach (var item in request.Tables)
                    {
                        if (item.IsAddNew)
                        {
                            ++idTbl;
                            ++idex;
                            M_Ban ban = new M_Ban();
                            ban.Ma_Ban = idTbl;
                            ban.Ma_Outlet = request.MaOutlet;
                            ban.Ten_Ban = idex.ToString();
                            ban.X = item.X;
                            ban.Y = item.Y;
                            ban.DonVi = request.DonVi;
                            listBan.Add(ban);
                        }
                        else
                        {
                            Expression<Func<M_Ban, bool>> mb = o => o.Ma_Outlet == request.MaOutlet && o.DonVi == request.DonVi && o.Deleted == 0 && o.Ma_Ban == item.Id;
                            var banExist = await _banRepository.GetFirstOrDefaultAsync(mb);

                            if (banExist != null && (!banExist.X.Equals(item.X) || !banExist.Y.Equals(item.Y)))
                            {
                                banExist.X = item.X;
                                banExist.Y = item.Y;
                                await _banRepository.UpdateAsync(banExist);
                            }
                        }
                    }
                    if (listBan.Count > 0)
                    {
                        await _banRepository.AddRangeAsync(listBan);
                    }
                    await _outletRepository.UpdateAsync(outletExist);
                    _outletRepository.CommitTransactionAsync();
                    _logger.LogInformation("End AddTableToOutletCommand");
                    return 1;
                }
                catch(Exception ex)
                {
                    _logger.LogError("End AddTableToOutletCommand");
                    _outletRepository.RollbackTransactionAsync();
                    return 0;
                }
            }

        }
    }
}
