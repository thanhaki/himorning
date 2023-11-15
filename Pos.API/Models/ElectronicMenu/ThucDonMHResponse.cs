namespace Pos.API.Models.ElectronicMenu
{
    public class ListThucDons
    {
        public int Ma_TD { set; get; }
        public string Ten_TD { set; get; }
        public IEnumerable<ItemMatHangTD> ListMH { get; set; }
    }
    public class ItemMatHangTD
    {
        public int Ma_MH { get; set; }
        public int? SoLuongDaBan { get; set; } = 0;
        public string Ten_MH { get; set; }
        public decimal? Gia_Ban { get; set; }
        public string? HinhAnh_MH01 { get; set; }
        public List<string>? ListImages { set; get; }
        public string? MieuTa_MH { get; set; }
        public string? Video_MH { get; set; }
        public InfoDonVi InforDonVi { set; get; }
    }
    public class DataElectronic
    {
        public IEnumerable<ListThucDons> ListThucDons { set; get; }
        public InfoDonVi InforDonVi { set; get; }
    }

    public class InfoDonVi 
    {
        public int DonVi { set; get; }
        public string TenCongTy { set; get; }
        public string LogoDonVi { set; get; }
        public string DiaChiDonVi { set; get; }
        public string Phone { set; get; }
        public string Email { set; get; }
        public string? AnhBiaPCDonVi { get; set; }
        public string? AnhBiaIPDonVi { get; set; }
        public string? AnhBiaSPDonVi { get; set; }
    }
}
