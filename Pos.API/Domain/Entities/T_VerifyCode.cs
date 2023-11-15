using Pos.API.Common;
using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class T_VerifyCode : EntityBase
    {
        [Key]
        public string CodeVerify { get; set; }
        public DateTime? DateActivate { get; set; }
        public DateTime DateRequest { get; set; } = Utilities.GetDateTimeSystem();
    }
}
