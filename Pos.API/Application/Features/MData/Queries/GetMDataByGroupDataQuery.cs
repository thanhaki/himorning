using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace User.API.Application.Features.MData.Queries
{

    public class GetMDataByGroupDataQuery
    {
        public class QueryGroupData : IRequest<MDataResponse>
        {
        }

        public class Handler : IRequestHandler<QueryGroupData, MDataResponse>
        {
            private readonly ISalerRepository _salerRepository;
            private readonly IMDataRepository _mDataRepository;
            private readonly IMapper _mapper;

            public Handler(IMDataRepository mDataRepository, IMapper mapper, ISalerRepository salerRepository)
            {
                _mDataRepository = mDataRepository ?? throw new ArgumentNullException(nameof(mDataRepository));
                _salerRepository = salerRepository ?? throw new ArgumentNullException(nameof(salerRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<MDataResponse> Handle(QueryGroupData request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Data, bool>> getMdata = u => u.Deleted == 0 && !u.isLock && (u.GroupData == CmContext.GROUP_DATA.TTDONVI.ToDescription() || 
                u.GroupData == CmContext.GROUP_DATA.NGANHHANG.ToDescription() || 
                u.GroupData == CmContext.GROUP_DATA.LOAIDANHMUCTHUCHI.ToDescription() ||
                u.GroupData == CmContext.GROUP_DATA.TINHTRANGDONHANG.ToDescription());

                var listMasterData = await _mDataRepository.GetAsync(getMdata, null);

                Expression<Func<M_Saler, bool>> getSalers = u => u.Deleted == 0;
                var salrs = await _salerRepository.GetAsync(getSalers, null);
                return new MDataResponse
                {
                    TTDonVis = listMasterData.Where(x => x.GroupData == CmContext.GROUP_DATA.TTDONVI.ToDescription()).ToList(),
                    NganhHangs = listMasterData.Where(x => x.GroupData == CmContext.GROUP_DATA.NGANHHANG.ToDescription()).OrderBy(x => x.No).ToList(),
                    Salers = salrs.ToList(),
                    LoaiDanhMucThuChi = listMasterData.Where(x => x.GroupData == CmContext.GROUP_DATA.LOAIDANHMUCTHUCHI.ToDescription()).OrderBy(x => x.No).ToList(),
                    TinhTrangDonHang = listMasterData.Where(x => x.GroupData == CmContext.GROUP_DATA.TINHTRANGDONHANG.ToDescription()).OrderBy(x => x.No).ToList(),
                };
            }
        }
    }
}
