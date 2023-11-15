using AutoMapper;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class KhuyenMaiRepository : RepositoryBase<M_KhuyenMai>, IKhuyenMaiRepository
    {
        public KhuyenMaiRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
            
        }
        public async Task<IEnumerable<KhuyenMaiModalResponse>> GetAllKhuyenMai(int id)
        {
            var result = (from km in _dbContext.M_KhuyenMai
                          where km.DonVi == id && km.Deleted == 0
                          select new KhuyenMaiModalResponse
                          {
                              Id = km.SoKhuyenMai,
                              SoKhuyenMai = km.SoKhuyenMai,
                              MaKhuyenMai = km.MaKhuyenMai,
                              TenKhuyenMai = km.TenKhuyenMai,
                              LoaiKhuyenMai = km.LoaiKhuyenMai, 
                              Loai = km.LoaiKhuyenMai ==  1  ? "Khuyến Mãi %" : "Khuyến mãi theo số tiền",
                              KhuyenMaiTuNgay = km.KhuyenMaiTuNgay,                    
                              KhuyenMaiDenNgay = km.KhuyenMaiDenNgay,
                              GiaTriKhuyenMai = km.GiaTriKhuyenMai,
                              MinHoaDon = km.MinHoaDon,
                              MaxKhuyenMai = km.MaxKhuyenMai,
                              ApDungThuTrongTuan = km.ApDungThuTrongTuan,
                              ThuHai = km.ThuHai,
                              ThuBa = km.ThuBa,
                              ThuTu = km.ThuTu,
                              ThuNam = km.ThuNam,
                              ThuSau = km.ThuSau,
                              ThuBay = km.ThuBay,
                              ChuNhat = km.ChuNhat,
                              ApDungTheoKhungGio = km.ApDungTheoKhungGio,
                              ApDungHoaDon = km.ApDungHoaDon,
                              ApDungDanhMuc = km.ApDungDanhMuc,
                              ApDungMatHang = km.ApDungMatHang,
                              DoiTuongTatCa = km.DoiTuongTatCa,
                              MieuTaKhuyenMai = km.MieuTaKhuyenMai,
                              DoiTuongNhomKhachHang = km.DoiTuongNhomKhachHang,
                              DoiTuongTheThanhVien = km.DoiTuongTheThanhVien,
                              DonVi = km.DonVi,
                          }).OrderByDescending(x => x.DonVi).ToList();


            return result;
        }
    }
}
