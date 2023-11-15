using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.MatHang.Commands
{
    public class DeleteMatHangCommand
    {
        public class DeleteMatHangRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<DeleteMatHangRequest>
        {
            private readonly IMatHangRepository _matHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateMatHangCommand> _logger;
            public Handler(IMatHangRepository matHangRepository, IMapper mapper, ILogger<UpdateMatHangCommand> logger)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _logger = logger;
            }

            public async Task<Unit> Handle(DeleteMatHangRequest request, CancellationToken cancellationToken)
            {
                var list = await _matHangRepository.GetMatHangByIds(request.Ids, request.DonVi.Value);
                foreach (var item in list)
                {
                    item.Deleted = 1;
                }
                await _matHangRepository.UpdateRangeAsync(list.ToList());
                _logger.LogInformation($"{list.Count()} Mat Hang is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}
