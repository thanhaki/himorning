using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using System.Globalization;
using static System.Net.WebRequestMethods;

namespace Pos.API.Infrastructure.Repositories
{
    public class PhieuThuChiRepository: RepositoryBase<T_PhieuThuChi>, IPhieuThuChiRepository
    {
        public PhieuThuChiRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        { }

        public async Task<IEnumerable<PhieuThuChiModalRespose>> GetAllPhieuThuChi(int id, int typ, int[] DanhMucThuChi, ThoiGianFilter? thoiGian)
        {
            DateTime tempFromDate;
            DateTime tempTodate;
            DateTime date = DateTime.Now;
            var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            if (string.IsNullOrEmpty(thoiGian.TuNgay) && string.IsNullOrEmpty(thoiGian.DenNgay))
            {
                tempFromDate = firstDayOfMonth;
                tempTodate = lastDayOfMonth;
            }
            else
            {
                try
                {
                    tempFromDate = Convert.ToDateTime(thoiGian.TuNgay);
                    tempTodate = Convert.ToDateTime(thoiGian.DenNgay);
                }
                catch
                {
                    tempFromDate = firstDayOfMonth;
                    tempTodate = lastDayOfMonth;
                }
            }

            var result = from p in _dbContext.T_PhieuThuChi
                         join dm in _dbContext.M_DanhMuc_ThuChi on p.MaDanhMucThuChi equals dm.MaDanhMucThuChi
                         join httt in _dbContext.M_Data on p.SoHinhThucThanhToan equals httt.No
                         where p.DonVi == id  && p.Loai_PhieuThuChi == typ && httt.GroupData == "HINHTHUCTHANHTOAN" && 
                         (DanhMucThuChi.Length == 0 || DanhMucThuChi.Contains(dm.MaDanhMucThuChi)) && 
                         (DanhMucThuChi.Length > 0 && !thoiGian.IsFilterTheoNgay  || p.CreateDate.Date >= tempFromDate.Date && p.CreateDate.Date <= tempTodate.Date)
                         && p.Deleted == 0
                         select new PhieuThuChiModalRespose
                         {
                             Id = p.So_PhieuThuChi,
                             So_PhieuThuChi = p.So_PhieuThuChi,
                             Ma_PhieuThuChi = p.Ma_PhieuThuChi,
                             Loai_PhieuThuChi = p.Loai_PhieuThuChi,
                             MaDanhMucThuChi = p.MaDanhMucThuChi,
                             NgayLapPhieu = p.NgayLapPhieu,
                             ThoiGianGhiNhan = p.ThoiGianGhiNhan,
                             MaNhomDoiTuong = p.MaNhomDoiTuong,
                             MaDoiTuong = p.MaDoiTuong,
                             DonVi = p.DonVi,
                             GiaTriThuChi = p.GiaTriThuChi,
                             HoachToanKinhDoanh = p.HoachToanKinhDoanh,
                             SoHinhThucThanhToan = p.SoHinhThucThanhToan,
                             NoiDung = p.NoiDung,
                             FileThuChi = p.FileThuChi,
                             Ten_DanhMucThuChi = dm.Ten_DanhMucThuChi,
                             HinhThucThanhToan = httt.Data,
                             TinhTrangThanhToan =(
                                p.Deleted == 1 ? "đã hủy" : "hoàn thành"
                            ),

                         };
            return result;
        }
    }
}
