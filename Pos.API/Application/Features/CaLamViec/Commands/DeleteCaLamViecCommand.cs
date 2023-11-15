using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.CaLamViec.Commands
{
    public class DeleteCaLamViecCommand
    {
        public class DeleteCaLamViecRequest : IRequest<int>
        {
            public int So_CaLamViec { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<DeleteCaLamViecRequest,int>
        {
            private readonly ICaLamViecRepository _caLamViecRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteCaLamViecCommand> _logger;
            public Handler(ICaLamViecRepository caLamViecRepository,IMapper mapper, ILogger<DeleteCaLamViecCommand> logger)
            {
                _caLamViecRepository = caLamViecRepository ?? throw new ArgumentNullException(nameof(caLamViecRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(DeleteCaLamViecRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_CaLamViec, bool>> getIdCa = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.So_CaLamViec == request.So_CaLamViec;
                var getBydIdCa = await _caLamViecRepository.GetAsync(getIdCa);
                if (getBydIdCa.Count > 0)
                {
                    await _caLamViecRepository.DeleteRangeAsync(getBydIdCa.ToList());
                }
                else
                {
                    return -1;
                }
                _logger.LogInformation($"Ca làm việc is successfully deleted.");
                return 1;
            }
        }
    }
}