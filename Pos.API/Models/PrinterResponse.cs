namespace Pos.API.Models
{
    public class PrinterModelResponse
    {
        public int Ma_Printer { get; set; }
        public string? Ten_Printer { get; set; }
        public string IP { get; set; }
        public int Port { get; set; }
        public bool MoKetTien { get; set; }
        public int Ma_Outlet { get; set; }
        public int MaxNumPrint { get; set; }
        public int NumPrints { get; set; }
        public bool Preview { get; set; }
        public bool InTamTinh { get; set; }
        public bool ShowLogo { get; set; }
        public string? Logo { get; set; }
        public bool EditAddress { get; set; }
        public string? Address { get; set; }
        public bool ShowFooter { get; set; }
        public string? InfoFooter { get; set; }
        public string? GhiChu { get; set; }
        public int DonVi { get; set; }
        public string IP1
        {
            get { return !string.IsNullOrEmpty(IP) && IP.Split(".").Count() == 4 ? IP.Split(".")[0] : ""; }
        }
        public string IP2
        {
            get { return !string.IsNullOrEmpty(IP) && IP.Split(".").Count() == 4 ? IP.Split(".")[1] : ""; }
        }
        public string IP3
        {
            get { return !string.IsNullOrEmpty(IP) && IP.Split(".").Count() == 4 ? IP.Split(".")[2] : ""; }
        }
        public string IP4
        {
            get { return !string.IsNullOrEmpty(IP) && IP.Split(".").Count() == 4 ? IP.Split(".")[3] : ""; }
        }
        public bool InQRThanhToan { get; set; }
        public string? Language { get; set; }
        public int Loai_Printer { get; set; }

    }
}
