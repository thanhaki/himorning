using AutoMapper;
using MediatR;
using Pos.API.Application.Features.VaiTroNhanVien.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.KhachHang.Commands
{
    public class AddKhachHangCommand
    {
        public class AddKhachHangRequest : IRequest<int>
        {
            public int? Ma_NKH { get; set; }
            public int? Ma_KH { get; set; }
            public int? Loai_KH { get; set; }
            public string Ten_KH { get; set; }
            public string DienThoai_KH { get; set; }
            public string Email_KH { get; set; }
            public string? NgaySinh_KH { get; set; }
            public bool GioiTinh_KH { get; set; }
            public string DiaChi_KH { get; set; }
            public string? TinhThanhPho_KH { get; set; }
            public string? QuanHuyen_KH { get; set; }
            public string GhiChu_KH { get; set; }
            public int? Ma_TTV { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddKhachHangRequest, int>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly INhomKhachHangRepository _nhomKhachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddKhachHangCommand> _logger;
            private readonly IDonViRepository _donViRepository;
            public Handler(IKhachHangRepository khachHangRepository, IDonViRepository donViRepository, IMapper mapper, ILogger<AddKhachHangCommand> logger)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(AddKhachHangRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        return 0;
                    }
                    _khachHangRepository.BeginTransactionAsync();
                    var khachHang = _mapper.Map<M_KhachHang>(request);
                    if (khachHang != null)
                    {
                        if (request.Ma_KH == 0)
                        {
                            Func<IQueryable<M_KhachHang>, IOrderedQueryable<M_KhachHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_KH);
                            Expression<Func<M_KhachHang, bool>> fillter = u => u.DienThoai_KH == request.DienThoai_KH && u.Deleted == 0 && u.DonVi == request.DonVi;
                            var checkNv = await _khachHangRepository.GetFirstOrDefaultAsync(fillter);
                            var maxId = await _khachHangRepository.GetMaxIdAsync(orderingFunc);
                            if (checkNv != null)
                            {
                                _khachHangRepository.CommitTransactionAsync();
                                return -1;
                            }

                            // Tính mã hiển thị KH00000,DT00000
                            Expression<Func<M_KhachHang, bool>> filterbyDV = u => u.Loai_KH == request.Loai_KH && u.DonVi == request.DonVi && u.Deleted == 0;
                            var getMaHienThi = await _khachHangRepository.GetAsync(filterbyDV);
                            string prefix = request.Loai_KH == 1001 ? "KH" : "DT";

                            string maHienThi = Utilities.FormatCode(prefix, 10, "0");
                            if (getMaHienThi != null && getMaHienThi.Count > 0)
                            {
                                var maxMa = getMaHienThi.OrderByDescending(x => x.MaHienThi_KH).FirstOrDefault();
                                maHienThi = Utilities.FormatCode(prefix, 10, string.IsNullOrEmpty(maxMa.MaHienThi_KH) ? "0" : maxMa.MaHienThi_KH);
                            }
                            khachHang.MaHienThi_KH = maHienThi;


                            khachHang.Ma_KH = maxId == null ? 1 : maxId.Ma_KH + 1;
                            khachHang.NgaySinh_KH = Convert.ToDateTime(request.NgaySinh_KH);
                            khachHang.DonVi = request.DonVi;
                            await _khachHangRepository.AddAsync(khachHang);
                        }
                        else
                        {
                            Expression<Func<M_KhachHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_KH == request.Ma_KH;
                            var kh = await _khachHangRepository.GetFirstOrDefaultAsync(fillter);
                            if (kh != null)
                            {
                                _mapper.Map(request, kh);
                                await _khachHangRepository.UpdateAsync(kh);
                            }

                        }


                        _logger.LogInformation($"khach Hang {Unit.Value} is successfully created.");
                    }
                    _khachHangRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _khachHangRepository.RollbackTransactionAsync();
                    return -1;
                    throw;
                }

            }
        }
    }
}
