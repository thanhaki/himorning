using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.HinhThucTT.Commands;
using Pos.API.Application.Features.HinhThucTT.Queries;
using Pos.API.Models;
namespace Pos.API.Controllers
{
    [Route("api/httt")]
    [ApiController]
    public class HinhThucTTController : BaseController
    {
        private readonly IMediator _mediator;
        public HinhThucTTController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpGet("", Name = "GetHtttByDonVi")]
        public async Task<IActionResult> GetHtttByDonVi()
        {
            int donVi = GetDonvi();

            var query = new GetHinhThucTTByDonVi.Query(donVi);
            var listHttt = await _mediator.Send(query);

            return Ok(listHttt);
        }

        [HttpPost("AddHinhThucTT")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddHinhThucTTCommand.AddHinhThucTTRequest command)
        {
            int donVi = GetDonvi();
            command.DonVi = donVi;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên hình thức thanh toán đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Đơn vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("UpdateHinhThucTT")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateHinhThucTTCommand.UpdateHinhThucTTRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }
    }
}
