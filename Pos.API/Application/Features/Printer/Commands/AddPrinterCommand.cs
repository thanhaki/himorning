using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.Printer.Commands
{
    public class AddPrinterCommand
    {
        public class AddPrinterRequest : IRequest<int>
        {
            public string Ten_Printer { get; set; }
            public string IP { set; get; }
            public int Port { get; set; }
            public bool MoKetTien { get; set; }
            public string GhiChu { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<AddPrinterRequest, int>
        {
            private readonly IPrinterRepository _printerRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddPrinterCommand> _logger;

            public Handler(IPrinterRepository printerRepository, IMapper mapper, ILogger<AddPrinterCommand> logger, IDonViRepository donViRepository)
            {
                _printerRepository = printerRepository ?? throw new ArgumentNullException(nameof(printerRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(AddPrinterRequest request, CancellationToken cancellationToken)
            {
                var printer = _mapper.Map<M_Printer>(request);
                if (printer != null)
                {

                    Expression<Func<M_DonVi, bool>> predicate = u => u.DonVi == request.DonVi && u.Deleted == 0;
                    var donvi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donvi == null) return 0;

                    Func<IQueryable<M_Printer>, IOrderedQueryable<M_Printer>> orderingFunc = x => x.OrderByDescending(X => X.Ma_Printer);
                    var maxId = await _printerRepository.GetMaxIdAsync(orderingFunc);
                    Expression<Func<M_Printer, bool>> fillter_MH = u => u.IP == request.IP && u.Deleted == 0 && u.DonVi == request.DonVi;
                    var checkip = await _printerRepository.GetFirstOrDefaultAsync(fillter_MH);
                    if (checkip != null) return -1;

                    printer.Ma_Printer = maxId == null ? 1 : maxId.Ma_Printer + 1;
                    await _printerRepository.AddAsync(printer);
                    _logger.LogInformation($"Printer {Unit.Value} is successfully created.");
                }
                return 1;
            }
        }
    }
}
