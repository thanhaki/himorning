using Pos.API.Common;

namespace Pos.API.Models
{
    public class OutletResponse
    {
        public int Ma_Outlet { get; set; }
        public string Ten_Outlet { get; set; }
        public int SoLuongBan { get; set; }
        public int DonVi { get; set; }
        public List<Tablesponse> Tables { get; set; }
    }
    public class Tablesponse
    {
        public int Id { get; set; }
        public decimal X { get; set; }
        public decimal Y { get; set; }
        public string MieuTaBan { set; get; }
        public string TenBan { set; get; }
        public int TinhTrangDonHang { set; get; }
        public int LoaiDonHang { set; get; }
        public DateTime? CreateDate { set; get; }
        public int? ThoiGianSuDung
        {
            get
            {
                if (CreateDate == null) 
                { 
                    return 0; 
                } else
                {
                    var diff = DateTime.Now.Subtract(CreateDate.Value);
                    return (int)diff.TotalMinutes;
                }
            }
        }
        public int InTamTinh { set; get; }
    }
}
