using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PostBill.Queries
{
    public class GetAllBillByDonViQuery
    {
        public class QueryBillDv : IRequest<IEnumerable<BillResponse>>
        {
            public FilterBillRequest Filter { get; set; }
            public int? DonVi { set; get; }
        }
        public class Handler : IRequestHandler<QueryBillDv, IEnumerable<BillResponse>>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IDonHangChiTietRepository _donHangChiTietRepository;
            private readonly IMapper _mapper;

            public Handler(IMapper mapper, IDonHangRepository donHangRepository, IDonHangChiTietRepository donHangChiTietRepository)
            {
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
                _donHangChiTietRepository = donHangChiTietRepository ?? throw new ArgumentNullException(nameof(donHangChiTietRepository));
            }

            public async Task<IEnumerable<BillResponse>> Handle(QueryBillDv request, CancellationToken cancellationToken)
            {
                Expression<Func<T_DonHang, bool>> expression = x => x.DonVi == request.DonVi && x.Deleted == 0;
                var data = await _donHangRepository.GetBills(request.DonVi.Value, request.Filter);

                if (data.Count() == 0) return data;

                var maDhs = data.Select(x => x.MaDonHang).ToArray();

                var ctdhs = await _donHangChiTietRepository.GetBillDetails(maDhs, request.DonVi.Value, request.Filter);

                var tempData = data.ToList();

                foreach (var item in tempData)
                {
                    item.ListBillDetails = ctdhs.Where(x => x.SoDonHang == item.SoDonHang);
                }
                return tempData;
            }
        }
    }
}
