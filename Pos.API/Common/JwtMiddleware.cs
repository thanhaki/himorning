using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Pos.API.Application.Persistence;
using Pos.API.Constans;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Pos.API.Common
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<JwtMiddleware> _logger;

        public JwtMiddleware(RequestDelegate next, ILogger<JwtMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context, IUserRepository userService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                attachUserToContext(context, userService, token);

            await _next(context);
        }

        private void attachUserToContext(HttpContext context, IUserRepository userService, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                string strScret = Utilities.GetString("JWT:Secret");
                var key = Encoding.ASCII.GetBytes(strScret);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == ClaimTypes.Name).Value + "";
                // attach user to context on successful jwt validation
                context.Items["User"] = userService.GetUserByUserName(userId);
            }
            catch (Exception ex)
            {
                // do nothing if jwt validation fails
                // user is not attached to context so request won't have access to secure routes
                var msg = ex.Message.ToString();
                _logger.LogError(ex, msg);
            }
        }
    }
}
