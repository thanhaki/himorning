using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;
using Pos.API.Models;

namespace Pos.API.Application.Features.PostBill.Commands
{
    public class UpdateBillTamTinhCommand : IRequest<int>
    {
        public class BillDHTamTinhRequest : IRequest<int>
        {
            public int? DonVi { set; get; }
            public string MaDonHang { set; get; }
        }

        public class Handler : IRequestHandler<BillDHTamTinhRequest, int>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IMapper _mapper;
            public Handler(
                IMapper mapper,
                IDonHangRepository donHangRepository)
            {
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<int> Handle(BillDHTamTinhRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<T_DonHang, bool>> filterDH = x => x.DonVi == request.DonVi && request.MaDonHang == x.MaDonHang;
                var dH = await _donHangRepository.GetFirstOrDefaultAsync(filterDH);
                if (dH != null)
                {
                    dH.InTamTinh = 1;
                    await _donHangRepository.UpdateAsync(dH);
                }
                return 1;
            }
        }
    }
}
