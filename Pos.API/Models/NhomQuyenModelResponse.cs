using Pos.API.Domain.Common;

namespace Pos.API.Models
{
    public class NhomQuyenModelResponse : EntityBase
    {
        public int id { get; set; }
        public int Ma_NhomQuyen { get; set; }
        public int No { get; set; }
        public int Ma_ChucNang { get; set; }
        public string? TenNhomQuyen { get; set; }
        public string Data { get; set; }
        public string Type { get; set; }
        public string GhiChuNhomQuyen { get; set; }
        public int DonVi { get; set; }
        public bool? IsCheck { get; set; }
    }
}
