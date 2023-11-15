namespace Pos.API.Models
{
    public class HoaDonKHModelResponse
    {
        public int Id { get; set; }
        public int SoDonHang { get; set; }
        public string? MaDonHang { get; set; }
        public DateTime Ngay_DonHang { get; set; }
        public decimal ThanhTien_DonHang { get; set; }
        public DateTime? ThoiGianThanhToan { get; set; }
        public string? ThuNgan { get; set; }
        public int TinhTrangDonHang { get; set; }
        public string? TinhTrangDon { get; set; }

    }
}
