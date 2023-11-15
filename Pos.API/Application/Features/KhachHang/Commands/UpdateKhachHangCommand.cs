using AutoMapper;
using MediatR;
using Pos.API.Application.Features.NhomKhachHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.KhachHang.Commands
{
    public class UpdateKhachHangCommand
    {
        public class UpdateKhachHangRequest : IRequest
        {
            public int Ma_KH { get; set; }
            public string Ten_KH { get; set; }
            public string GhiChu_KH { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdateKhachHangRequest>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateKhachHangCommand> _logger;
            public Handler(IKhachHangRepository khachHangRepository, IMapper mapper, ILogger<UpdateKhachHangCommand> logger)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateKhachHangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_KhachHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_KH == request.Ma_KH;

                var kh = await _khachHangRepository.GetFirstOrDefaultAsync(fillter);
                if (kh != null)
                {
                    _mapper.Map(request, kh);
                    await _khachHangRepository.UpdateAsync(kh);
                    _logger.LogInformation($"Khach Hang {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
