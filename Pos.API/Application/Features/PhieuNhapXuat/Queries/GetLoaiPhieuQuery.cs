using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PhieuNhapXuat.Queries
{
    public class GetLoaiPhieuQuery
    {
        public class LoaiPhieuQuery : IRequest<MDataResponse>
        {
            public int DonVi { get; set; }
            public string Type { get; set; }
            
        }
        public class Handler : IRequestHandler<LoaiPhieuQuery, MDataResponse>
        {
            private readonly ILoaiPhieuRepository _loaiPhieuRepository;
            private readonly IMapper _mapper;

            public Handler(ILoaiPhieuRepository loaiPhieuRepository, IMapper mapper)
            {
                _loaiPhieuRepository = loaiPhieuRepository ?? throw new ArgumentNullException(nameof(loaiPhieuRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<MDataResponse> Handle(LoaiPhieuQuery request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Data, bool>> getLoaiP = u => u.Deleted == 0 && !u.isLock 
                && (u.GroupData == CmContext.GROUP_DATA.LOAIPHIEU.ToDescription() && u.Type == request.Type);

                var List = await _loaiPhieuRepository.GetAsync(getLoaiP, null);
                return new MDataResponse
                {
                    LoaiPhieu = List.Where(x => x.GroupData == CmContext.GROUP_DATA.LOAIPHIEU.ToDescription()).OrderBy(x=>x.No).ToList()
                };
            }
        }
    } 
}
