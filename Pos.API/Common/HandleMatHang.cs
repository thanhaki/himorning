using Pos.API.Domain.Entities;
using System.Security.Cryptography;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Common
{
    public static class HandleMatHang
    {
        public static (decimal thoiGian, string ghiChu) SoThoiGianDaSuDung(M_MatHang matHang, DateTime? gioVao, DateTime? gioRa)
        {
            decimal thoiGian = 1;
            string ghiChu = "";
            if (matHang == null || gioVao == null || gioRa == null)
                return (1, "");

            TimeSpan span = gioRa.Value.Subtract(gioVao.Value);
            int Minutesdiff = span.Minutes;
            int Hoursdiff = span.Hours;
            int Daysdiff = span.Days;
            // Tính toán lại mặt hàng theo thời gian
            if (matHang != null && matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
            {
                var dateUsed = gioRa.Value.RemoveSecond() - gioVao.Value.RemoveSecond();
                thoiGian = (decimal)dateUsed.TotalMinutes;
            }
            ghiChu = string.Format("{0} Phút", Minutesdiff);

            if (Daysdiff > 0)
            {
                ghiChu = string.Format("{0} Ngày {1} Giờ {2} Phút", Daysdiff, Hoursdiff, Minutesdiff);
            }

            if (Hoursdiff > 0)
            {
                ghiChu = string.Format("{0} Giờ {1} Phút", Hoursdiff, Minutesdiff);
            }
            return (thoiGian.ToFixed(2), ghiChu);
        }
    }
}
