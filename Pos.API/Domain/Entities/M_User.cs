using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_User : EntityBase
    {
        [Key]
        public int No_User { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string? FullName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string? PIN { get; set; }
        public int IsLock { get; set; } = 0;
        public int Role_Code { get; set; } = 0;
        public string? PCName { get; set; }
        public string? IP { get; set; }
        public string? IP2 { get; set; }
        public string IsAdministrator { get; set; } = "1";
        public int? Permistion { get; set; } = 1;
    }
}
