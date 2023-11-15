using AutoMapper;
using MediatR; 
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;
using static Pos.API.Application.Features.NhanVienHeSo.Commands.AddHoSoNhanVienCommand.AddHoSoNVRequest;

namespace Pos.API.Application.Features.NhomKhachHang.Commands
{
    public class DeleteNhomKhachHangCommand
    {
        public class DeleteNhomKhachHangRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }

        }

        public class Handler : IRequestHandler<DeleteNhomKhachHangRequest>
        {
            private readonly INhomKhachHangRepository _nhomKhachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteNhomKhachHangCommand> _logger;
            public Handler(INhomKhachHangRepository nhomKhachHangRepository, IMapper mapper, ILogger<DeleteNhomKhachHangCommand> logger)
            {
                _nhomKhachHangRepository = nhomKhachHangRepository ?? throw new ArgumentNullException(nameof(nhomKhachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(DeleteNhomKhachHangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Nhom_KhachHang, bool>> getByid = x => x.Deleted == 0 && request.Ids.Contains(x.Ma_NKH) && x.DonVi == request.DonVi;
                var list = await _nhomKhachHangRepository.GetAsync(getByid);
                if (list.Count > 0)
                {
                    list.ToList().ForEach(item => item.Deleted = 1);
                    await _nhomKhachHangRepository.UpdateRangeAsync(list.ToList());
                }
                _logger.LogInformation($"Nhom khach hang {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}
