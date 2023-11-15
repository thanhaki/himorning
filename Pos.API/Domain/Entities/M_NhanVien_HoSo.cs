using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_NhanVien_HoSo : EntityBase
    {
        [Key]
        public int File_No { get; set; }
        public int So_NV { get; set; }
        public string File_Name { get; set; }
        public string? File_Description { get; set; }
        public DateTime File_Start { get; set; }
        public DateTime File_End { get; set; }
        public DateTime File_Warning { get; set; }
        public string File_URL { get; set; }
        public int File_Status { get; set; }
    }
}
