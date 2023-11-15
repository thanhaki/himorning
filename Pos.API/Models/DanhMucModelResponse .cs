using System.ComponentModel.DataAnnotations;

namespace Pos.API.Models
{
    public class DanhMucModelResponse
    {
        public int Id { get; set; }
        public int DonVi { get; set; }
        public int Soluong_MH { get; set; }
        public string Ten_DanhMuc { get; set; }
    }
}
