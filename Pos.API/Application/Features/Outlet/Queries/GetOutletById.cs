using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Outlet.Queries.GetOutletQueries
{
    public class GetOutletById
    {
        public class OutletReq : IRequest<OutletResponse>
        {
            [Required]
            public int Id { get; set; }

            public int? DonVi { get; set; }
        }

        public class Handler : IRequestHandler<OutletReq, OutletResponse>
        {
            private readonly IOutletRepository _outletRepository;
            private readonly IBanRepository _banRepository;
            private readonly IMapper _mapper;

            public Handler(IMapper mapper, IOutletRepository outletRepository, IBanRepository banRepository)
            {
                _outletRepository = outletRepository ?? throw new ArgumentNullException(nameof(outletRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _banRepository = banRepository ?? throw new ArgumentNullException(nameof(banRepository));
            }

            public async Task<OutletResponse> Handle(OutletReq request, CancellationToken cancellationToken)
            {
                var tblResponse = await _banRepository.GetTable(request.DonVi, request.Id);

                Expression<Func<M_Outlet, bool>> filterOutlet = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_Outlet == request.Id;
                var outlet = await _outletRepository.GetFirstOrDefaultAsync(filterOutlet);
                OutletResponse outletResponse = new OutletResponse();
                if (outlet != null)
                {
                    outletResponse.Tables = tblResponse.ToList();
                    outletResponse.DonVi = outlet.DonVi;
                    outletResponse.Ten_Outlet = outlet.Ten_Outlet + "";
                    outletResponse.Ma_Outlet = outlet.Ma_Outlet;
                    outletResponse.SoLuongBan = outlet.SoLuongBan;
                }
                return outletResponse;
            }
        }
    }
}
