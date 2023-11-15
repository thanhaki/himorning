using Microsoft.AspNetCore.Identity;
using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pos.API.Domain.Entities
{
    public class T_TokenInfo : EntityBase
    {
        [Key]
        public Guid Id { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public T_TokenInfo()
        {
            Id = Guid.NewGuid();
        }
    }
}
