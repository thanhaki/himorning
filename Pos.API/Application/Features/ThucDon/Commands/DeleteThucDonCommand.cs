using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using static Pos.API.Application.Features.DonViMatHang.Commands.DeleteDonViMatHangCommand;
using System.Linq.Expressions;
using Pos.API.Constans;

namespace Pos.API.Application.Features.ThucDon.Commands
{
    public class DeleteThucDonCommand
    {
        public class DeleteThucDonRequest : IRequest
        {
            public int? Ids { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<DeleteThucDonRequest>
        {
            private readonly IThucDonRepository _thucDonRepository;
            private readonly ILogger<DeleteThucDonCommand> _logger;

            public Handler(IThucDonRepository thucDonRepository, ILogger<DeleteThucDonCommand> logger)
            {
                _thucDonRepository = thucDonRepository ?? throw new ArgumentNullException(nameof(thucDonRepository));
                _logger = logger;
            }

            public async Task<Unit> Handle(DeleteThucDonRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_ThucDon, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.Ma_TD == request.Ids.Value;
                var lst = await _thucDonRepository.GetListAsyncToUpdate(getByid);
                if (lst.Count() > 0)
                {
                    lst.ToList().ForEach(item => item.Deleted = 1);
                    await _thucDonRepository.UpdateRangeAsync(lst.ToList());
                    _logger.LogInformation($"Thuc Don {Unit.Value} is successfully deleted.");
                }
                return Unit.Value;
            }
        }
    }
}
