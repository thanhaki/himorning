using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Features.MatHang.Commands;
using Pos.API.Application.Features.NhanVien.Commands;
using Pos.API.Application.Features.NhanVien.Queries;
using Pos.API.Application.Features.Printer.Queries;
using Pos.API.Application.Features.VaiTroNhanVien.Commands;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class NhanVienController : BaseController
    {
        private readonly IMediator _mediator;
        public NhanVienController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        }

        [HttpGet("{id}", Name = "GetAllNhanVien")]
        [ProducesResponseType(typeof(M_User), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllPrinter(int id)
        {
            var command = new GetAllNhanVienQuery.GetNhanVienQuery(id);
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("AddNhanVien")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddNhanVienCommand.AddNhanVienRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên nhân viên đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("UpdateNhanVien")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateNhanVienCommand.UpdateNhanVienRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("DeleteNhanVien")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]       
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteNhanVienCommand.DeleteNhanVienRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }
    }
}
