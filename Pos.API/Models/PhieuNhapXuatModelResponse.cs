namespace Pos.API.Models
{
    public class PhieuNhapXuatModelResponse
    {
        public int Id { get; set; }
        public int Ma_PNX { get; set; }
        public string Ma_Phieu { get; set; }
        public int Loai_Phieu { get; set; }
        public string LoaiPhieu { get; set; }
        public string Nhom_Phieu { get; set; }
        public int TinhTrang_Phieu { get; set; }
        public string Ten_Phieu { get; set; }
        public DateTime NgayLap_Phieu { get; set; }
        public DateTime NgayDeXuat { get; set; }
        public string NguoiDeXuat { get; set; }
        public string GhiChu { get; set; }
        public string MieuTaFile { get; set; }
        public int SoLuong { get; set; }
        public string TrangThai { get; set; }
    }
}
