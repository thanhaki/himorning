using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_Printer : EntityBase
    {
        [Key]
        public int Ma_Printer { get; set; }
        public string? Ten_Printer { get; set; }
        public string IP { get; set; }
        public int Port { get; set; }
        public bool MoKetTien { get; set; }
        public int Ma_Outlet { get; set; }
        public int MaxNumPrint { get; set; }
        public int NumPrints { get; set; }
        public int Loai_Printer { get; set; }
        public bool Preview { get; set; }
        public bool InTamTinh { get; set; }
        public bool ShowLogo { get; set; }
        public string? Logo { get; set; }
        public bool EditAddress { get; set; }
        public string? Address { get; set; }
        public bool ShowFooter { get; set; }
        public string? InfoFooter { get; set; }
        public string? GhiChu { get; set; }
        public bool InQRThanhToan { get; set; }
        public string? Language { get; set; }
    }
}
