namespace Pos.API.Models
{
    public class MatHangModelRespose
    {
        public int? Id { get; set; }
        public int? Ma_MH { get; set; }
        public int? DonVi { get; set; }
        public string Ten_MH { get; set; }
        public int? Ma_DanhMuc { get; set; }
        public int? Deleted { get; set; }
        public int? Ma_Printer { get; set; }
        public decimal? Gia_Ban { get; set; }
        public decimal? Gia_Default 
        {
            get { return Gia_Ban; }
        }
        public decimal? Gia_Von { get; set; }
        public bool? IsNhapGiaBan { set; get; }
        public string HinhAnh_MH { get; set; }
        public string Ten_DanhMuc { get; set; }
        public int? Ma_DonVi { get; set; }
        public string Ten_DonVi { get; set; }
        public string Ten_LoaiMH { get; set; }
        public int? Id_LoaiMH { get; set; }
        public string? Mota_MH { get; set; }
        public string? MauSac_MH { get; set; }
        public int? SoLuongTonKho { get; set; }
        public int? TonKhoMin { get; set; }
        public bool? TonKho { get; set; }
        public int SoLuong { get; set; }
        public string Ten_ThucDon { get; set; }
        public string Ten_Printer { get; set; }
        public int? ThoiGianApDung { get; set; } = 0;
        public int? LoaiThoiGianApDung { get; set; } = 0;
        public string? QRCode { set; get; }
    }
}
