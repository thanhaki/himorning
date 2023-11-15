using System.ComponentModel.DataAnnotations;

namespace Pos.API.Models
{
    public class UserModelResponse
    {
        public int No_User { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public int DonVi { get; set; }
        public string TenDonVi { get; set; }
        public string DiaChiDonVi { get; set; }
        public int? NganhHang { get; set; }
        public int? Role_Code { get; set; }
        public string Phone { get; set; }
        public string Pin { get; set; }
        public int? Ma_NhomQuyen { get; set; }
        public string? TenNhomQuyen { get; set; }
        public List<int> ListPermission { get; set; }
        public string IsAdministrator { get; set; }
        public string? LogoDonVi { get; set; }
        public string? AnhBiaPCDonVi { get; set; }
        public string? AnhBiaIPDonVi { get; set; }
        public string? AnhBiaSPDonVi { get; set; }
        public string? AnhNganHang { get; set; }
    }

    public class UploadResponse
    {
        public string Url { set; get; }
    }
}
