using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PostBill.Commands
{
    public class PrintBillCommand : IRequest<M_Printer>
    {
        public class PrintBillRequest : IRequest<M_Printer>
        {
            public int? DonVi { set; get; }
            public int SoDonHang { set; get; }
            public string MaDonHang { set; get; }

        }

        public class Handler : IRequestHandler<PrintBillRequest, M_Printer>
        {
            private readonly IPrinterRepository _printerRepository;
            private readonly IDonHangRepository _donHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<PaymentCommand> _logger;
            public Handler(
                IMapper mapper, ILogger<PaymentCommand> logger,
                IPrinterRepository printerRepository,
                IDonHangRepository donHangRepository)
            {
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _printerRepository = printerRepository ?? throw new ArgumentNullException(nameof(printerRepository));
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<M_Printer> Handle(PrintBillRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    // Get Printer
                    Expression<Func<M_Printer, bool>> filterPrint = x => x.DonVi == request.DonVi && x.Deleted == 0 && x.Loai_Printer == 1;
                    var printer = await _printerRepository.GetFirstOrDefaultAsync(filterPrint);

                    if (printer != null)
                    {
                        if (printer.NumPrints == 0)
                        {
                            printer.NumPrints += 1;
                        }
                        // Get Don Hang
                        Expression<Func<T_DonHang, bool>> filterDH = x => x.DonVi == request.DonVi && x.SoDonHang == request.SoDonHang && x.MaDonHang == request.MaDonHang;
                        var dh = await _donHangRepository.GetFirstOrDefaultAsync(filterDH);
                        if (dh != null)
                        {
                            if (printer.MaxNumPrint > 0 && dh.SoLanIn > printer.MaxNumPrint)
                            {
                                printer.MaxNumPrint = -1;
                                return printer;
                            }
                            else
                            {
                               if (printer.MoKetTien)
                                {
                                    // Implement mở két tiền
                                }
                            }
                        }
                    }
                    return printer;
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }
    }
}
