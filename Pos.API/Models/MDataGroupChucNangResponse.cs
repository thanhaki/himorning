using Pos.API.Domain.Entities;

namespace Pos.API.Models
{
    public class MDataGroupChucNangResponse
    {
        public List<NhomQuyenModelResponse> DangKy { get; set; }
        public List<NhomQuyenModelResponse> BanHang { get; set; }
        public List<NhomQuyenModelResponse> ThietLap { get; set; }
        public List<NhomQuyenModelResponse> ThuChi { get; set; }
        public List<NhomQuyenModelResponse> BaoCao { get; set; }
        public List<NhomQuyenModelResponse> MatHang { get; set; }
        public List<NhomQuyenModelResponse> KhoHang { get; set; }
        public List<NhomQuyenModelResponse> DoiTuong { get; set; }
        public List<int> ListCheck { get; set; }

    }
}
