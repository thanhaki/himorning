using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;

namespace Pos.API.Application.Features.MatHang.Commands
{
    public class CoppyProductCommand
    {
        public class CoppyMatHangRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<CoppyMatHangRequest>
        {
            private readonly IMatHangRepository _matHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<CoppyProductCommand> _logger;
            public Handler(IMatHangRepository matHangRepository, IMapper mapper, ILogger<CoppyProductCommand> logger)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _logger = logger;
            }

            public async Task<Unit> Handle(CoppyMatHangRequest request, CancellationToken cancellationToken)
            {
                var list = await _matHangRepository.GetMatHangByIds(request.Ids, request.DonVi.Value);

                Func<IQueryable<M_MatHang>, IOrderedQueryable<M_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_MH);
                var maxId = await _matHangRepository.GetMaxIdAsync(orderingFunc);

                List<M_MatHang> result = new List<M_MatHang>();
                int i = 0;
                try
                {
                    if (maxId != null)
                    {
                        _matHangRepository.BeginTransactionAsync();
                        foreach (var item in list)
                        {
                            i++;
                            item.Ma_MH = (maxId.Ma_MH + i);
                            result.Add(item);
                        }
                        await _matHangRepository.AddRangeAsync(result);
                        _matHangRepository.CommitTransactionAsync();
                    }
                }
                catch (Exception ex)
                {
                    _matHangRepository.RollbackTransactionAsync();
                    throw;
                }
                return Unit.Value;
            }
        }
    }
}
