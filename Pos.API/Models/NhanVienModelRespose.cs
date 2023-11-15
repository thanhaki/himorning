namespace Pos.API.Models
{
    public class NhanVienModelRespose
    {
        public int Id { get; set; }
        public int No_User { get; set; }
        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int DonVi { get; set; }
        public int? Ma_NhomQuyen { get; set; }
        public string? TenNhomQuyen { get; set; }
        public string? PIN { get; set; }

        public string Password { get; set; }
    }
}
