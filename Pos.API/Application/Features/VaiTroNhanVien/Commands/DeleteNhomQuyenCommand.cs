using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DanhMuc.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Serilog.Filters;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.VaiTroNhanVien.Commands
{
    public class DeleteNhomQuyenCommand
    {
        public class DeleteNhomQuyenRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }

        }

        public class Handler : IRequestHandler<DeleteNhomQuyenRequest>
        {
            private readonly INhomQuyenRepository _nhomQuyenRepository;
            private readonly INhomQuyenChucNangRepository _nhomQuyenChucNangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteNhomQuyenCommand> _logger;
            public Handler(INhomQuyenRepository nhomQuyenRepository, INhomQuyenChucNangRepository nhomQuyenChucNangRepository, IMapper mapper, ILogger<DeleteNhomQuyenCommand> logger)
            {
                _nhomQuyenRepository = nhomQuyenRepository ?? throw new ArgumentNullException(nameof(nhomQuyenRepository));
                _nhomQuyenChucNangRepository = nhomQuyenChucNangRepository ?? throw new ArgumentNullException(nameof(nhomQuyenChucNangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(DeleteNhomQuyenRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_NhomQuyen, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.Ma_NhomQuyen);
                var list = await _nhomQuyenRepository.GetAsync(getByid);
                if (list.Count > 0)
                {
                    list.ToList().ForEach(item => item.Deleted = 1);
                    await _nhomQuyenRepository.UpdateRangeAsync(list.ToList());
                }
               
                if (list != null)
                {
                    Expression<Func<M_NhomQuyen_ChucNang, bool>> id = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.Ma_NhomQuyen);
                    var lst = await _nhomQuyenChucNangRepository.GetAsync(id);
                    foreach (var item in lst)
                    {
                        await _nhomQuyenChucNangRepository.DeleteAsync(item);
                    }
                }
                _logger.LogInformation($"Danh Muc {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}
