using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PhieuNhapXuat.Commands
{
    public class UpdateTrangThaiPhieuCommand
    {
        public class UpdateTrangThaiRequest : IRequest
        {
            public int Ma_PNX { get; set; }
            public int DonVi { get; set; }
            public string Ma_Phieu { get; set; }
            public string Nhom_Phieu { get; set; }
            public List<MatHang> ListUpdateMatHang { get; set; }
            public class MatHang
            {
                public int Ma_MH { get; set; }
                public string Ten_MH { get; set; }
                public int SoLuong { get; set; }
                public int? soLuongKiemKe { get; set; }
                public int? SoLuongChenhLech { get; set; }
                public string? LyDoDieuChinh { get; set; }
            }
        }

        public class Handler : IRequestHandler<UpdateTrangThaiRequest>
        {
            private readonly IPhieuNhapXuatRepository _phieuXuatNhapRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdatePhieuNhapXuatCommand> _logger;
            private readonly ILichSuDonHangRepository _lichSuDonHangRepository;

            public Handler(IPhieuNhapXuatRepository phieuXuatNhapRepository,IMapper mapper, ILichSuDonHangRepository lichSuDonHangRepository, ILogger<UpdatePhieuNhapXuatCommand> logger)
            {
                _phieuXuatNhapRepository = phieuXuatNhapRepository ?? throw new ArgumentNullException(nameof(phieuXuatNhapRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _lichSuDonHangRepository = lichSuDonHangRepository ?? throw new ArgumentNullException(nameof(lichSuDonHangRepository));
            }
            public async Task<Unit> Handle(UpdateTrangThaiRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<T_PhieuNhapXuat, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_PNX == request.Ma_PNX;
                var getPhieuById = await _phieuXuatNhapRepository.GetFirstOrDefaultAsync(fillter);
                //hủy phiếu => update huy
                if (getPhieuById != null)
                {
                    getPhieuById.TinhTrang_Phieu = 3;

                    string prefix = string.Empty;
                    if (request.Nhom_Phieu == "NHAP")
                        prefix = "Hủy phiếu nhập hàng";
                    if (request.Nhom_Phieu == "XUAT")
                        prefix = "Hủy phiếu xuất hàng";
                    if (request.Nhom_Phieu == "KIEMKE")
                        prefix = "Hủy phiếu kiểm kê";

                    //Add T_LichSu_MatHang
                    List<T_LichSu_MatHang> lsDHList = new List<T_LichSu_MatHang>();
                    Func<IQueryable<T_LichSu_MatHang>, IOrderedQueryable<T_LichSu_MatHang>> orderLs = x => x.OrderByDescending(X => X.MaLichSu);
                    var maxMaLS = await _lichSuDonHangRepository.GetMaxIdAsync(orderLs);
                    int nextMaLS = maxMaLS == null ? 1 : maxMaLS.MaLichSu + 1;
                    foreach (var item in request.ListUpdateMatHang)
                    {
                        T_LichSu_MatHang t_LichSu_MatHang = new T_LichSu_MatHang();
                        t_LichSu_MatHang.MaLichSu = nextMaLS;
                        t_LichSu_MatHang.Ten_MH = item.Ten_MH;
                        t_LichSu_MatHang.Ma_MH = item.Ma_MH;
                        t_LichSu_MatHang.Ma_ThamChieu = request.Ma_Phieu;
                        t_LichSu_MatHang.LoaiPhieu_ThamChieu = getPhieuById.Loai_Phieu ;
                        t_LichSu_MatHang.NgayLichSu = Utilities.GetDateTimeSystem(); 

                        t_LichSu_MatHang.NoiDung_LichSu = prefix;
                        int soLuongConLai = await _lichSuDonHangRepository.GetSoLuongConLaiMH(request.DonVi, item.Ma_MH);
                        if (request.Nhom_Phieu == "NHAP")
                        {
                            t_LichSu_MatHang.SoLuongThayDoi = -item.SoLuong;
                            t_LichSu_MatHang.SoLuongConLai = soLuongConLai + t_LichSu_MatHang.SoLuongThayDoi;
                        }

                        if (request.Nhom_Phieu == "XUAT")
                        {
                            t_LichSu_MatHang.SoLuongThayDoi = item.SoLuong;
                            t_LichSu_MatHang.SoLuongConLai = soLuongConLai + t_LichSu_MatHang.SoLuongThayDoi;
                        }

                        if (request.Nhom_Phieu == "KIEMKE")
                        {
                            t_LichSu_MatHang.SoLuongThayDoi = item.SoLuongChenhLech*(-1);
                            t_LichSu_MatHang.SoLuongConLai = soLuongConLai + t_LichSu_MatHang.SoLuongThayDoi;
                        }

                        t_LichSu_MatHang.DonVi = (int)request.DonVi;
                        t_LichSu_MatHang.NgayLichSu = Utilities.GetDateTimeSystem();
                        lsDHList.Add(t_LichSu_MatHang);

                        nextMaLS++;
                    }

                    await _lichSuDonHangRepository.AddRangeAsync(lsDHList);
                    await _phieuXuatNhapRepository.UpdateAsync(getPhieuById);
                    _logger.LogInformation($"Huy phieu nhap xuat {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
