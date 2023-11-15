using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.HinhThucTT.Commands
{
    public class UpdateHinhThucTTCommand
    {
        public class UpdateHinhThucTTRequest : IRequest
        {
            public int SoHinhThucThanhToan { get; set; }
            public int TinhTrangHinhThucThanhToan { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdateHinhThucTTRequest>
        {
            private readonly IHinhThucTTRepository _hinhThucTTRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateHinhThucTTCommand> _logger;
            public Handler(IHinhThucTTRepository hinhThucTTRepository, IMapper mapper, ILogger<UpdateHinhThucTTCommand> logger)
            {
                _hinhThucTTRepository = hinhThucTTRepository ?? throw new ArgumentNullException(nameof(hinhThucTTRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateHinhThucTTRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_HinhThucThanhToan, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.SoHinhThucThanhToan == request.SoHinhThucThanhToan;

                var update = await _hinhThucTTRepository.GetFirstOrDefaultAsync(fillter);
                if (update != null)
                {
                    _mapper.Map(request, update);
                    await _hinhThucTTRepository.UpdateAsync(update);
                    _logger.LogInformation($"Hinh thức thanh toán {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
