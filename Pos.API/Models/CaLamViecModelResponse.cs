namespace Pos.API.Models
{
    public class CaLamViecModelResponse
    {
        public int? So_CaLamViec { get; set; }
        public string? Ma_CaLamViec { get; set; }
        public int TinhTrang { get; set; }
        public string? MoTa_CaLamViec { get; set; }
        public double? HeSo_CaLamViec { get; set; } = 0;
        public bool? IsCheck { get; set; }
    }
}
