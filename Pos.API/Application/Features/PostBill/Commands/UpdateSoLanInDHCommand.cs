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
    public class UpdateSoLanInDHCommand : IRequest<int>
    {
        public class DonHangRequest : IRequest<int>
        {
            public int? DonVi { set; get; }
            public int SoDonHang { set; get; }
            public string MaDonHang { set; get; }
            public int SoLanIn { set; get; }
            public bool InTamTinh { set; get; }
        }

        public class Handler : IRequestHandler<DonHangRequest, int>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<PaymentCommand> _logger;
            public Handler(
                IMapper mapper, ILogger<PaymentCommand> logger,
                IDonHangRepository donHangRepository)
            {
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<int> Handle(DonHangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<T_DonHang, bool>> filterDH = x => x.DonVi == request.DonVi && x.SoDonHang == request.SoDonHang && x.MaDonHang == request.MaDonHang;
                var dh = await _donHangRepository.GetFirstOrDefaultAsync(filterDH);
                if (dh != null)
                {
                    dh.SoLanIn += request.SoLanIn;
                    if (request.InTamTinh)
                    {
                        dh.InTamTinh = 1;
                    }
                    await _donHangRepository.UpdateAsync(dh);
                }
                return 1;
            }
        }
    }
}
