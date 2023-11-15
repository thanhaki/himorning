using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Printer.Commands
{
    public class DeletePrinterCommand
    {
        public class DeletePrinterRequest : IRequest<int>
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<DeletePrinterRequest, int>
        {
            private readonly IPrinterRepository _printerRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeletePrinterCommand> _logger;

            public Handler(
                IMapper mapper,
                IPrinterRepository printerRepository, ILogger<DeletePrinterCommand> logger)
            {
                _printerRepository = printerRepository ?? throw new ArgumentNullException(nameof(printerRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(DeletePrinterRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Printer, bool>> predicate = o => request.Ids.Contains(o.Ma_Printer);
                var printer = await _printerRepository.GetAsync(predicate);
                if (printer.Count == 0) { return -1; }

                foreach (var item in printer)
                {
                    item.Deleted = 1;
                }

                await _printerRepository.UpdateRangeAsync(printer.ToList());
                return 1;
            }

        }
    }
}
