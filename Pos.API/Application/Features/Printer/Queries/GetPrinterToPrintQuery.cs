using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Printer.Queries
{
    public class GetPrinterToPrintQuery
    {
        public class GetPrint : IRequest<PrinterModelResponse>
        {
            public int DONVI { get; set; }
            public GetPrint(int id)
            {
                DONVI = id;
            }
        }

        public class Handler : IRequestHandler<GetPrint, PrinterModelResponse>
        {
            private readonly IPrinterRepository _printerRepository;
            private readonly IMapper _mapper;

            public Handler(IPrinterRepository printerRepository, IMapper mapper)
            {
                _printerRepository = printerRepository ?? throw new ArgumentNullException(nameof(printerRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<PrinterModelResponse> Handle(GetPrint request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Printer, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DONVI && x.Loai_Printer == 1;
                var printers = await _printerRepository.GetFirstOrDefaultAsync(predicate);
                return _mapper.Map<PrinterModelResponse>(printers);
            }
        }
    }
}
