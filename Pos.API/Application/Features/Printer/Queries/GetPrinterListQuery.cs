using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.Printer.Queries
{
    public class GetPrinterListQuery
    {
        public class GetPrinterQuery : IRequest<List<PrinterModelResponse>>
        {
            public int DONVI { get; set; }
            public GetPrinterQuery(int id)
            {
                DONVI = id;
            }
        }

        public class Handler : IRequestHandler<GetPrinterQuery, List<PrinterModelResponse>>
        {
            private readonly IPrinterRepository _printerRepository;
            private readonly IMapper _mapper;

            public Handler(IPrinterRepository printerRepository, IMapper mapper)
            {
                _printerRepository = printerRepository ?? throw new ArgumentNullException(nameof(printerRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<PrinterModelResponse>> Handle(GetPrinterQuery request, CancellationToken cancellationToken)
            {
                var printers = await _printerRepository.GetAllDataPrinter(request.DONVI);
                return printers.ToList();
            }
        }
    }
}
