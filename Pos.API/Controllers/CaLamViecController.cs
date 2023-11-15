using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.CaLamViec.Commands;
using Pos.API.Application.Features.CaLamViec.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class CaLamViecController : BaseController
    {
        private readonly IMediator _mediator;
        public CaLamViecController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
         
        [HttpGet("{id}", Name = "GetAllCaLamViec")]
        [ProducesResponseType(typeof(M_CaLamViec), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_CaLamViec>> GetWorkShiftDonVi(int id)
        {
            var query = new GetCaLamViecByDonVi.CaLVQuery(id);
            var listWorkShift = await _mediator.Send(query);
            return Ok(listWorkShift);
        }
        [HttpPost("AddCaLamViec")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddCaLamViecCommand.CaLamViecRequest command)
        {
            int donVi = GetDonvi();
            command.DonVi = donVi;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tạo mới Ca làm việc không thành công." });
            if (result == 2)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Mã ca làm việc đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Đơn vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("UpdateCaLamViec")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateCaLamViecCommand.UpdateCaLamViecRequest command)
        {
            int donVi = GetDonvi();
            command.DonVi = donVi;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Chỉnh sửa Ca làm việc không thành công." });
            if (result == 2)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Mã ca làm việc đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Đơn vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("DeleteCaLamViecById")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> DeleteCaLamViecById(DeleteCaLamViecCommand.DeleteCaLamViecRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result =  await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                                  new ResponseBase { Status = "Error", Message = "Xóa Ca làm việc không thành công." });
            else
                return Ok();
        }
    }
}
