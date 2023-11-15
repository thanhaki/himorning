using System.ComponentModel.DataAnnotations;

namespace Pos.API.Models
{
    public class LanguageModelResponse
    {
        public string? Type { get; set; }
        public string? Data { get; set; }
        public string? VietNamese { get; set; }
        public string? English { get; set; }
        public int? MaChucNang { get; set; }
        public int? MaNganhHang { get; set; }
    }
}
