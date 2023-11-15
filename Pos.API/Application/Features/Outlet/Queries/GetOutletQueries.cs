using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Outlet.Queries.GetOutletQueries
{
    public class GetOutletQueries
    {
        public class GetAllOutleQueries : IRequest<List<M_Outlet>>
        {
            public int DonVi { get; set; }

            public GetAllOutleQueries(int dv)
            {
                DonVi = dv;
            }
        }

        public class Handler : IRequestHandler<GetAllOutleQueries, List<M_Outlet>>
        {
            private readonly IOutletRepository _outletRepository;
            private readonly IMapper _mapper;

            public Handler(IMapper mapper, IOutletRepository outletRepository)
            {
                _outletRepository = outletRepository ?? throw new ArgumentNullException(nameof(outletRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<M_Outlet>> Handle(GetAllOutleQueries request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Outlet, bool>> filterOutlet = u => u.Deleted == 0 && u.DonVi == request.DonVi;
                var outlets = await _outletRepository.GetAsync(filterOutlet, null);
                return outlets.OrderByDescending(x=>x.Ma_Outlet).ToList();
            }
        }
    }
}
