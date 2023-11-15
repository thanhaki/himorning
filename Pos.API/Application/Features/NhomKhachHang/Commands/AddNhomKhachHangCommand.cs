using AutoMapper;
using MediatR;
using Pos.API.Application.Features.KhachHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhomKhachHang.Commands
{
    public class AddNhomKhachHangCommand
    {
        public class AddNhomKhachHangRequest : IRequest<int>
        {
            public string Ten_NKH { get; set; }
            public string GhiChu_NKH { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddNhomKhachHangRequest, int>
        {
            private readonly INhomKhachHangRepository _nhomKhachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddKhachHangCommand> _logger;
            public Handler(INhomKhachHangRepository nhomKhachHangRepository, IMapper mapper, ILogger<AddKhachHangCommand> logger)
            {
                _nhomKhachHangRepository = nhomKhachHangRepository ?? throw new ArgumentNullException(nameof(nhomKhachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(AddNhomKhachHangRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _nhomKhachHangRepository.BeginTransactionAsync();
                    var nhomKH = _mapper.Map<M_Nhom_KhachHang>(request);
                    if (nhomKH != null)
                    {
                        Func<IQueryable<M_Nhom_KhachHang>, IOrderedQueryable<M_Nhom_KhachHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_NKH);
                        Expression<Func<M_Nhom_KhachHang, bool>> fillter = u => u.Ten_NKH.ToLower() == request.Ten_NKH.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var check = await _nhomKhachHangRepository.GetFirstOrDefaultAsync(fillter);
                        var maxId = await _nhomKhachHangRepository.GetMaxIdAsync(orderingFunc);
                        if (check != null)
                        {
                            _nhomKhachHangRepository.CommitTransactionAsync();
                            return -1; 
                        }
                        nhomKH.Ma_NKH = maxId == null ? 1 : maxId.Ma_NKH + 1;
                        nhomKH.Ten_NKH = request.Ten_NKH;
                        nhomKH.GhiChu_NKH = request.GhiChu_NKH;
                        nhomKH.DonVi = request.DonVi.Value;
                        await _nhomKhachHangRepository.AddAsync(nhomKH);
                        _logger.LogInformation($"Nhom khach Hang {Unit.Value} is successfully created.");
                    }
                    _nhomKhachHangRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception)
                {
                    _nhomKhachHangRepository.RollbackTransactionAsync();
                    throw;
                }

            }
        }
    }
}
