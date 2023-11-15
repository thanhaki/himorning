using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.VerifyCode.Commands;
using Pos.API.Application.Features.VerifyCode.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    [Route("api/verifycode")]
    [ApiController]
    public class VerifyCodeController : ControllerBase
    {
        private readonly IMediator _mediator;
        public VerifyCodeController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ConfirmCode(ConfirmCodeValid.QueryCodeVerify query)
        {
            var verifyCode = await _mediator.Send(query);

            if (verifyCode == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Mã xác nhận không đúng vui lòng thử lại." });
            }
            return Ok(new
            {
                token = verifyCode
            });
        }
        /// <summary>
        /// Send code in case forgot password
        /// Return 0: User is not exists in system, 1 code sent
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("sendcode")]
        public async Task<IActionResult> SendCodeForgotPassword(UpdateVerifyCodeCommand.AddCodeRequest request)
        {

            int result = await _mediator.Send(request);

            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Email không tồn tài trên hệ thống." });
            }
            return StatusCode(StatusCodes.Status200OK,
                    new ResponseBase { Status = "Success", Message = "" });
        }
    }
}
