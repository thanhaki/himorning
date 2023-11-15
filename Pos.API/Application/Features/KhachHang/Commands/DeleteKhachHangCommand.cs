using AutoMapper;
using MediatR;
using Pos.API.Application.Features.VaiTroNhanVien.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.KhachHang.Commands
{
    public class DeleteKhachHangCommand
    {
        public class DeleteKhachHangRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }

        }

        public class Handler : IRequestHandler<DeleteKhachHangRequest>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteNhomQuyenCommand> _logger;
            public Handler(IKhachHangRepository khachHangRepository, IMapper mapper, ILogger<DeleteNhomQuyenCommand> logger)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(DeleteKhachHangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_KhachHang, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.Ma_KH.Value);
                var list = await _khachHangRepository.GetAsync(getByid);
                list.ToList().ForEach(item => item.Deleted = 1);
                await _khachHangRepository.UpdateRangeAsync(list.ToList());
				_logger.LogInformation($"Khach Hang {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}