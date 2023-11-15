using AutoMapper;
using MediatR;
using Org.BouncyCastle.Crypto;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhomKhachHang.Commands
{
    public class UpdateKhachHangByIdNhom
    {
        public class UpdateKhachHangByIRequest : IRequest
        {
            public int Ma_NKH { get; set; }
            public string Ten_NKH { get; set; }
            public string GhiChu_NKH { get; set; }
            public int DonVi { get; set; }
            public int[] Ids { get; set; }
        }

        public class Handler : IRequestHandler<UpdateKhachHangByIRequest>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateKhachHangByIdNhom> _logger;
            public Handler(IKhachHangRepository khachHangRepository, IMapper mapper, ILogger<UpdateKhachHangByIdNhom> logger)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateKhachHangByIRequest request, CancellationToken cancellationToken)
            {
                if (request.Ids.Length > 0 )
                {
                    foreach (var item in request.Ids)
                    {
                        Expression<Func<M_KhachHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_KH == item;
                        var kh = await _khachHangRepository.GetFirstOrDefaultAsync(fillter);
                        if (kh != null)
                        {
                            kh.Ma_NKH = request.Ma_NKH;
                            _mapper.Map(request, kh);
                            await _khachHangRepository.UpdateAsync(kh);
                            _logger.LogInformation($"Nhom Khach Hang {Unit.Value} is successfully updated.");
                        }
                    }
                }
                return Unit.Value;

            }
        }
    }
}
