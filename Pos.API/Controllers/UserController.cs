using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Pos.API.Application.Features.User.Queries;
using Pos.API.Application.Features.VerifyCode.Commands;
using Pos.API.Application.Features.VerifyCode.Queries;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Pos.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IMediator _mediator;
        public UserController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(GetLogin.Query query)
        {
            var result = await _mediator.Send(query);
            if (string.IsNullOrEmpty(result.RefreshToken))
            {
                return StatusCode(StatusCodes.Status401Unauthorized,
                        new ResponseBase { Status = "Error", Message = result.Message });
            }
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh(RefreshTokenCommand.TokenApiRequest tokenApiModel)
        {
            var result = await _mediator.Send(tokenApiModel);

            if (tokenApiModel is null)
                return BadRequest("Invalid client request");

            return Ok(result);
        }

        /// <summary>
        /// Forgot password
        /// return: 0 user not found, 1 success, -1 confirm code is not exists or expired
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword(ForgetPasswordCommand.UpdatePasswordRequest query)
        {
            var result = await _mediator.Send(query);

            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Email không phù hợp với email bạn đã đăng ký. Vui lòng kiểm tra" });
            }

            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Mã xác nhận không tồn tại hoặc đã hết hạn." });
            }
            return StatusCode(StatusCodes.Status200OK, new ResponseBase { Status = "Success" });
        }

        /// <summary>
        /// Forgot password
        /// return: 0 user not found, 1 success, -1 confirm code is not exists or expired
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost("getuser")]
        public async Task<IActionResult> GetUserById(GetUserByIdQuery.QueryById query)
        {
            query.DonVi = GetDonvi();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Update password
        /// return: 0 user not found, 1 success, -1 confirm code is not exists or expired
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordCommand.ChangePasswordRequest query)
        {
            query.DonVi = GetDonvi();
            query.UserName = GetUsername();
            var result = await _mediator.Send(query);
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Mật khẩu hiện tại không khớp, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }
    }
}
