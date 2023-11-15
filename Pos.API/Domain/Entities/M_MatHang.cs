using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_MatHang : EntityBase
    {
        [Key]
        public int Ma_MH { get; set; }
        public string Ten_MH { get; set; }
        public int? Loai_MH { get; set; }
        public int? Ma_DanhMuc { get; set; }
        public int? Ma_DonVi { get; set; }
        public decimal? Gia_Ban { get; set; }
        public decimal? Gia_Von { get; set; }
        public bool? IsNhapGiaBan { get; set; }
        public string? Mota_MH { get; set; }
        public string? MauSac_MH { get; set; }
        public string? HinhAnh_MH { get; set; }
        public int? Ma_Printer { get; set; }
        public bool? TonKho { get; set; }
        public int? SoLuongTonKho { get; set; } = 0;
        public int? SoLuongDaBan { get; set; } = 0;
        public int? TonKhoMin { get; set; } = 0;
        public int? ThoiGianApDung { get; set; } = 0;
        public int? LoaiThoiGianApDung { get; set; } = 0;
        public string? HinhAnh_ChiaSe { get; set; }
        public string? HinhAnh_MH01 { get; set; }
        public string? HinhAnh_MH02 { get; set; }
        public string? HinhAnh_MH03 { get; set; }
        public string? HinhAnh_MH04 { get; set; }
        public string? HinhAnh_MH05 { get; set; }
        public string? HinhAnh_MH06 { get; set; }
        public string? HinhAnh_MH07 { get; set; }
        public string? HinhAnh_MH08 { get; set; }
        public string? HinhAnh_MH09 { get; set; }
        public string? HinhAnh_MH10 { get; set; }
        public string? Video_MH { get; set; }
        public string? MieuTa_MH { get; set; }
        public string? QRCode { get; set; }
    }
}
