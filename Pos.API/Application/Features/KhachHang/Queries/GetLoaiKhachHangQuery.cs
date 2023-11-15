using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.KhachHang.Queries
{
    public class GetLoaiKhachHangQuery
    {
        public class LoaiKhachHangQuery : IRequest<MDataResponse>
        {
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<LoaiKhachHangQuery, MDataResponse>
        {
            private readonly ILoaiPhieuRepository _loaiPhieuRepository;
            private readonly IMapper _mapper;

            public Handler(ILoaiPhieuRepository loaiPhieuRepository, IMapper mapper)
            {
                _loaiPhieuRepository = loaiPhieuRepository ?? throw new ArgumentNullException(nameof(loaiPhieuRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<MDataResponse> Handle(LoaiKhachHangQuery request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Data, bool>> getLoaiK = u => u.Deleted == 0 && !u.isLock
                && (u.GroupData == CmContext.GROUP_DATA.LOAIKHACH.ToDescription());

                var List = await _loaiPhieuRepository.GetAsync(getLoaiK, null);
                return new MDataResponse
                {
                    LoaiKhach = List.Where(x => x.GroupData == CmContext.GROUP_DATA.LOAIKHACH.ToDescription()).OrderBy(x => x.No).ToList()
                };
            }
        }
    }
}
