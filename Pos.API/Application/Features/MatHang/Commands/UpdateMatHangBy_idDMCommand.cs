using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.MatHang.Commands
{
    public class UpdateMatHangBy_idDMCommand
    {
        public class UpdateMatHangBy_idRequest : IRequest
        {
            public int Id { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<UpdateMatHangBy_idRequest>
        {
            private readonly IMatHangRepository _matHangRepository;
            private readonly ILogger<UpdateMatHangBy_idDMCommand> _logger;

            public Handler(IMatHangRepository matHangRepository, ILogger<UpdateMatHangBy_idDMCommand> logger)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _logger = logger;
            }

            public async Task<Unit> Handle(UpdateMatHangBy_idRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_MatHang, bool>> getByid = x => x.Deleted == 0 && x.Ma_MH == request.Id && x.DonVi == request.DonVi;
                var list = await _matHangRepository.GetAsync(getByid);
                foreach (var item in list)
                {
                    item.Ma_DanhMuc = 0;
                }
                await _matHangRepository.UpdateRangeAsync(list.ToList());
                _logger.LogInformation($"Mat Hang {Unit.Value} is successfully updated.(UpdateMatHangBy_idDMCommand)");
                return Unit.Value;
            }
        }
    }
}
