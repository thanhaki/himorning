using System.ComponentModel.DataAnnotations;

namespace Pos.API.Models
{
    public class AuthenticatedResponse
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public string? Message { get; set; }
        public UserModelResponse? User { get; set; }
    }
    public class TokenApiModel
    {
        [Required]
        public string AccessToken { get; set; }
        [Required]
        public string RefreshToken { get; set; }
    }
}
