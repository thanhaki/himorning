using MimeKit;
using Pos.API.Domain.Entities;

namespace Pos.API.Models
{
    public class MDataResponse
    {
        public List<M_Data> Packages { get; set; }
        public List<M_Data> TTDonVis { get; set; }
        public List<M_Data> NganhHangs { get; set; }
        public List<M_Saler> Salers { get; set; }
        public List<M_Data> LoaiDanhMucThuChi { get; set; }
        public List<M_Data> TinhTrangDonHang { get; set; }
        public List<M_Data> LoaiPhieu { get; set; }
        public List<M_Data> LoaiKhach { get; set; }
        public List<M_Data> PhongBan { get; set; }
        public List<M_Data> TinhTrangHoSoNhanVien { get; set; }
        public List<M_Data> LoaiHoSoNhanVien { get; set; }
        public List<M_Data> TrinhDo { get; set; }
    }
}
