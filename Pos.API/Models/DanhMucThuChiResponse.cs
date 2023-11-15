namespace Pos.API.Models
{
    public class DanhMucThuChiModelResponse
    {
        public int Id { get; set; }
        public int MaDanhMucThuChi { get; set; }
        public int Loai_DanhMucThuChi { get; set; }
        public string? Ten_DanhMucThuChi { get; set; }
        public string? GhiChu_DanhMucThuChi { get; set; }
        public int DonVi { get; set; }

    }
}
