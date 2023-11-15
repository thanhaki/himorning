using Pos.API.Common;
using Pos.API.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Models
{
    public class DonViModelResponse
    {
        public int MaDonVi { get; set; }
        public string TenDonVi { get; set; }
        public string DienThoaiLienHe { get; set; }
        public string Email { get; set; }
        public string DiaChiDonVi { get; set; }
        public DateTime NgayDangKy { get; set; }
        public DateTime NgayGiaHan { get; set; }
        public string GoiDichVu { get; set; }
        public int MaTinhTrang { get; set; }
        public string TenTinhTrang { get; set; }
        public M_Saler Supporter { get; set; }
        public int Approved { get; set; }
    }
}
