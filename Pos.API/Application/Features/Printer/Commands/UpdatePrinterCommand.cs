using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DanhMuc.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using static Pos.API.Application.Features.DanhMuc.Commands.UpdateDanhMucMatHangCommand;

namespace Pos.API.Application.Features.Printer.Commands
{
    public class UpdatePrinterCommand
    {
        public class UpdatePrinterRequest : IRequest
        {
            public int Ma_Printer { get; set; }
            public string Ten_Printer { get; set; }
            public string IP { get; set; }
            public int Port { get; set; }
            public bool MoKetTien { get; set; }
            public string GhiChu { get; set; }
            public int MaxNumPrint { get; set; }
            public int NumPrints { get; set; }
            public bool Preview { get; set; }
            public bool InTamTinh { get; set; }
            public bool EditAddress { get; set; }
            public string? Address { get; set; }
            public bool ShowFooter { get; set; }
            public string? InfoFooter { get; set; }
            public int DonVi { get; set; }
            public bool InQRThanhToan { get; set; }
            public string? Language { get; set; }
        }

        public class Handler : IRequestHandler<UpdatePrinterRequest>
        {
            private readonly IPrinterRepository _printerRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdatePrinterRequest> _logger;
            public Handler(IPrinterRepository printerRepository, IMapper mapper, ILogger<UpdatePrinterRequest> logger)
            {
                _printerRepository = printerRepository ?? throw new ArgumentNullException(nameof(printerRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(UpdatePrinterRequest request, CancellationToken cancellationToken)
            {
                var result = await _printerRepository.GetByIdAsync(request.Ma_Printer);
                if (result != null)
                {
                    _mapper.Map(request, result);
                    await _printerRepository.UpdateAsync(result);
                    _logger.LogInformation($"Printer {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
