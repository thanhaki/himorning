using Pos.API.Common;
using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace Pos.API.Domain.Entities
{
    public class M_DonVi : EntityBase
    {
        public string TenDonVi { get; set; }
        public string? LogoDonVi { get; set; }
        public string? AnhBiaPCDonVi { get; set; }
        public string? AnhBiaIPDonVi { get; set; }
        public string? AnhBiaSPDonVi { get; set; }
        public string? AnhNganHang { get; set; }
        public string DiaChiDonVi { get; set; }
        public string DienThoaiLienHe { get; set; }
        public string DienThoaiDonVi { set; get; }
        public string Email { get; set; }
        public string? GhiChu { get; set; }
        public DateTime NgayDangKy { get; set; } = Utilities.GetDateTimeSystem();
        public DateTime NgayGiaHan { get; set; }

        public int Supporter { get; set; }
        public int Approved { get; set; }
        public int NganhHang { get; set; }
        public string? ApproveBy { get; set; }
        public int GoiDichVu { get; set; }
        public int TinhTrang { get; set; }
    }
}
