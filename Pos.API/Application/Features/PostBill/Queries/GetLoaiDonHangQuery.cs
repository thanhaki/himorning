using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using static User.API.Application.Features.MData.Queries.GetMDataByGroupDataQuery;
using System.Linq.Expressions;
using static User.API.Application.Features.DanhMuc.Queries.GetDanhMucListQuery;
using Pos.API.Common;

namespace Pos.API.Application.Features.PostBill.Queries
{
    public class GetLoaiDonHangQuery
    {
        public class QueryLoaiDonHang : IRequest<List<M_Data>>
        {
            public int DonVi { get; set; }
            public QueryLoaiDonHang(int id)
            {
                DonVi = id;
            }
        }
        public class Handler : IRequestHandler<QueryLoaiDonHang, List<M_Data>>
        {
            private readonly IMDataRepository _mDataRepository;
            private readonly IMapper _mapper;

            public Handler(IMapper mapper, IMDataRepository mDataRepository)
            {
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _mDataRepository = mDataRepository;
            }

            public async Task<List<M_Data>> Handle(QueryLoaiDonHang request, CancellationToken cancellationToken)
            {
                var data = await _mDataRepository.GetDataByGroupdata(CmContext.GROUP_DATA.LOAIDONHANG.ToDescription());
                return data.ToList();
            }
        }
    }
}
