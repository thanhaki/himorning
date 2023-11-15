using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.BaoCao.Queries.MatHang.GetBaoCaoDanhMuc;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Infrastructure.Repositories
{
    public class DonHangChiTietRepository : RepositoryBase<T_DonHangChiTiet>, IDonHangChiTietRepository
    {
        public DonHangChiTietRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<ItemMatHangDH>> GetBillDetails(string[] MaDH, int donVi, FilterBillRequest filterBillRequest)
        {
            var data = from ctdh in _dbContext.T_DonHangChiTiet
                        join mh in _dbContext.M_MatHang.Where(x=>x.DonVi == donVi) on ctdh.Ma_MH equals mh.Ma_MH
                        join dmmh in _dbContext.M_DanhMuc_MatHang.Where(x=>x.DonVi == donVi) on mh.Ma_DanhMuc equals dmmh.Ma_DanhMuc
                        where ctdh.Deleted == 0 && ctdh.DonVi == donVi && MaDH.Contains(ctdh.MaDonHang)
                        select new ItemMatHangDH
                        {
                            Id = ctdh.Ma_MH,
                            SoLuong = ctdh.SoLuong_MH,
                            GhiChu = ctdh.GhiChu + "",
                            Ma_MH_Goc = ctdh.Ma_MH_Goc,
                            NoiDungGiamGia = ctdh.NoiDungGiamGia_MH,
                            Ten_MH = ctdh.Ten_MH,
                            Gia_Ban = ctdh.DonGia_MH,
                            GioVao = ctdh.GioVao == null ? ctdh.CreateDate : ctdh.GioVao,
                            GioRa = ctdh.GioRa,
                            SoDonHang = ctdh.SoDonHang,
                            MaDonHang = ctdh.MaDonHang,
                            LoaiChietKhau = ctdh.LoaiChietKhau,
                            TienGiamGia_DH = ctdh.TienGiamGia_DH,
                            PhanTramGiam_DH = ctdh.PhanTramGiam_DH,
                            ThanhTien_MH = ctdh.ThanhTien_MH,
                            Id_LoaiMH = mh.Loai_MH.Value,
                            LoaiThoiGianApDung = mh.LoaiThoiGianApDung,
                            QRCode = mh.QRCode,
                            ChietKhau = new ChietKhauItem
                            {
                                LoaiCk = ctdh.PhanTramGiamGia_MH > 0 ? (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM : (int)GIA_TRI_CHIET_KHAU.SO_TIEN,
                                ValueCk = ctdh.PhanTramGiamGia_MH > 0 ? ctdh.PhanTramGiamGia_MH : ctdh.TienGiamGia_MH
                            },
                            Ten_DanhMuc = dmmh.Ten_DanhMuc,
                            Ma_DanhMuc = dmmh.Ma_DanhMuc
                        };

            return data.ToList();
        }
    }
}
