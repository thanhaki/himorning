using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;
using System.Collections.Generic;
namespace User.API.Application.Features.DonHang.Queries
{
    public class GetTableOrderedByTableNo
    {
        public class QueryOrderedTableNo : IRequest<OrderedList> {
            public int TableNo { get; set; }
            public int? DonVi { get; set; }
            public string? MaDonHang { get; set; }
        }

        public class Handler : IRequestHandler<QueryOrderedTableNo, OrderedList>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IMapper _mapper;

            public Handler(IDonHangRepository donHangRepository, IMapper mapper)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<OrderedList> Handle(QueryOrderedTableNo request, CancellationToken cancellationToken)
            {
                if (!string.IsNullOrEmpty(request.MaDonHang))
                {
                    var listOrdered = await _donHangRepository.GetTableOrderedNew(request.MaDonHang, request.DonVi);
                    return listOrdered;
                }
                else
                {
                    var listOrdered = await _donHangRepository.GetTableOrdered(request.TableNo, request.DonVi);
                    return listOrdered;
                }
            }
        }
    }
}
