using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Outlet.Commands
{
    public class DeleteOutletCommand
    {
        public class DeleteRequest : IRequest<int>
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<DeleteRequest, int>
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

            public async Task<int> Handle(DeleteRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Outlet, bool>> predicate = o => request.Ids.Contains(o.Ma_Outlet) && o.DonVi == request.DonVi;
                var outlets = await _outletRepository.GetAsync(predicate);
                if (outlets.Count == 0) { return -1; }

                Expression<Func<M_Ban, bool>> filterBan = o => request.Ids.Contains(o.Ma_Outlet) && o.DonVi == request.DonVi;
                var listTbl = await _banRepository.GetAsync(filterBan);

                foreach (var item in outlets)
                {
                    item.Deleted = 1;
                }

                if (listTbl.Count > 0)
                {
                    foreach (var tbl in listTbl)
                    {
                        tbl.Deleted = 1;
                    }
                }
                await _outletRepository.UpdateRangeAsync(outlets.ToList());
                await _banRepository.UpdateRangeAsync(listTbl.ToList());
                return 1;
            }

        }
    }
}
