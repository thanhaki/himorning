using Pos.API.Domain.Common;

namespace Pos.API.Models
{
    public class KhuyenMaiIsCheckAdModelResponse : EntityBase
    {
        public int? Id { get; set; }
        public int SoKhuyenMai { get; set; }
        public int MaKhuyenMai { get; set; }
        public int? Ma { get; set; }
        public string Ten { get; set; }
        public int selectedValueAD { get; set; }
        public bool? IsCheck { get; set; }

    }
}
