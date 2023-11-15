using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Collections.Generic;
using System.Linq.Expressions;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Application.Features.HinhThucTT.Queries
{
    public class GetHinhThucTTByDonVi
    {
        public class Query : IRequest<List<HinhThucTTResponse>>
        {
            public int DonVi { get; set; }

            public Query(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<Query, List<HinhThucTTResponse>>
        {
            private readonly IHinhThucTTRepository _hinhThucTTRepository;
            private readonly IMDataRepository _mDataRepository;
            private readonly IMapper _mapper;

            public Handler(IHinhThucTTRepository hinhThucTTRepository, IMapper mapper, IMDataRepository mDataRepository)
            {
                _hinhThucTTRepository = hinhThucTTRepository ?? throw new ArgumentNullException(nameof(hinhThucTTRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _mDataRepository = mDataRepository ?? throw new ArgumentNullException(nameof(mDataRepository));
            }

            public async Task<List<HinhThucTTResponse>> Handle(Query request, CancellationToken cancellationToken)
            {
                Expression<Func<M_HinhThucThanhToan, bool>> filter = x=>x.DonVi == request.DonVi && x.Deleted == 0;
                var httts = await _hinhThucTTRepository.GetAsync(filter, null);
                List<HinhThucTTResponse> list= new List<HinhThucTTResponse>();
                if(httts == null || httts.Count == 0)
                {
                    var htttFromMdata = await _mDataRepository.GetDataByGroupdata(GROUP_DATA.HINHTHUCTHANHTOAN.ToDescription());
                    list = _mapper.Map<List<HinhThucTTResponse>>(htttFromMdata);
                    list.ToList().ForEach(item => item.TinhTrang = 0);
                }
                else
                {
                    list = _mapper.Map<List<HinhThucTTResponse>>(httts);
                    list.ToList().ForEach(item => item.TinhTrang = 1);
                }

                return list;
            }
        }
    }
}
