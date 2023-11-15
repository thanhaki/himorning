using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhomKhachHang.Commands
{
    public class UpdateNhomKhachHangCommand
    {
        public class UpdateNhomKhachHangRequest : IRequest
        {
            public int Ma_NKH { get; set; }
            public string Ten_NKH { get; set; }
            public string GhiChu_NKH { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdateNhomKhachHangRequest>
        {
            private readonly INhomKhachHangRepository _nhomKhachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateNhomKhachHangCommand> _logger;
            public Handler(INhomKhachHangRepository nhomKhachHangRepository, IMapper mapper, ILogger<UpdateNhomKhachHangCommand> logger)
            {
                _nhomKhachHangRepository = nhomKhachHangRepository ?? throw new ArgumentNullException(nameof(nhomKhachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateNhomKhachHangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Nhom_KhachHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_NKH == request.Ma_NKH;

                var nhomKh = await _nhomKhachHangRepository.GetFirstOrDefaultAsync(fillter);
                if (nhomKh != null)
                {
                    _mapper.Map(request, nhomKh);
                    await _nhomKhachHangRepository.UpdateAsync(nhomKh);
                    _logger.LogInformation($"Nhom Khach Hang {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
