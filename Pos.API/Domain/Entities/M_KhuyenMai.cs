using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_KhuyenMai : EntityBase
    {
        [Key]
        public int SoKhuyenMai { get; set; }
        public int MaKhuyenMai { get; set; }
        public string TenKhuyenMai { get; set; }
        public int LoaiKhuyenMai { get; set; }
        public decimal GiaTriKhuyenMai { get; set; }
        public decimal MinHoaDon { get; set; }
        public decimal MaxKhuyenMai { get; set; }
        public DateTime KhuyenMaiTuNgay { get; set; }
        public DateTime KhuyenMaiDenNgay { get; set; }
        public int ApDungThuTrongTuan { get; set; }
        public int ThuHai { get; set; }
        public int ThuBa { get; set; }
        public int ThuTu { get; set; }
        public int ThuNam { get; set; }
        public int ThuSau { get; set; }
        public int ThuBay { get; set; }
        public int ChuNhat { get; set; }
        public int ApDungHoaDon { get; set; }
        public int ApDungDanhMuc { get; set; }
        public int ApDungMatHang { get; set; }
        public int ApDungTheoKhungGio { get; set; }
        public int DoiTuongTatCa { get; set; }
        public int DoiTuongNhomKhachHang { get; set; }
        public int DoiTuongTheThanhVien { get; set; }
        public string MieuTaKhuyenMai { get; set; }
    }
}
