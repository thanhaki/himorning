using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;
using static Pos.API.Application.Features.MatHang.Commands.UpdateMatHangCommand;

namespace Pos.API.Application.Features.DonViMatHang.Commands
{
    public class UpdateDonViMatHangCommand
    {
        public class UpdateDonViMatHangRequest : IRequest
        {
            public int Ma_DonVi { get; set; }
            public int DonVi { get; set; }
            public string Ten_DonVi { get; set; }
        }

        public class Handler:IRequestHandler<UpdateDonViMatHangRequest>
        {
            private readonly IDonViMathangRepository _donViMatHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateDonViMatHangCommand> _logger;
            public Handler(IDonViMathangRepository donViMatHangRepository, IMapper mapper, ILogger<UpdateDonViMatHangCommand> logger)
            {
                _donViMatHangRepository = donViMatHangRepository ?? throw new ArgumentNullException(nameof(donViMatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateDonViMatHangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DonVi_MatHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_DonVi == request.Ma_DonVi;
                var dvMatHang = await _donViMatHangRepository.GetFirstOrDefaultAsync(fillter);
                if (dvMatHang != null)
                {
                    _mapper.Map(request, dvMatHang);
                    await _donViMatHangRepository.UpdateAsync(dvMatHang);
                    _logger.LogInformation($"Don Vi Mat Hang {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
