using Microsoft.EntityFrameworkCore;
using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pos.API.Domain.Entities
{
    public class M_ThucDon_MatHang : EntityBase
    {
        public int Ma_TD { get; set; }
        public int? Ma_MH { get; set; }
    }
}
