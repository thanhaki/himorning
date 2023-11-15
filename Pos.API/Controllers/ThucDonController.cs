using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Features.DonViMatHang.Queries;
using Pos.API.Application.Features.ThucDon.Commands;
using Pos.API.Application.Features.ThucDon.Queries;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;
using User.API.Application.Features.DanhMuc.Queries;

namespace Pos.API.Controllers
{
    public class ThucDonController : BaseController
    {
        private readonly IMediator _mediator;
        public ThucDonController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
        [HttpGet("{id}", Name = "GetAllThucDon")]
        [ProducesResponseType(typeof(M_ThucDon), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllThucDon(int id)
        {
            var query = new GetThucDonListQuery.GetThucDonQuery(id);
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }

        [HttpPost("AddThucDon")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddThucDonCommand.AddThucDonRequest command)
        {
            command.DonVi = GetDonvi();
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên thực đơn đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });

        }
        [HttpPost("UpdateThucDon")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateThucDonCommand.UpdateThucDonRequest command)
        {
            var dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên thực đơn đã tồn tại." });
            if (result == 1)
                return Ok();
            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("DeleteThucDon")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteThucDonCommand.DeleteThucDonRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("GetAllThucDonMatHangById")]
        [ProducesResponseType(typeof(MatHangModelRespose), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllThucDonMatHangById(GetThucDonMHById.ThucDonMatHangByIdQuery query)
        {
            query.DonVi = GetDonvi();
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }

        public class DaTaSort
        {
            public UpdateSortCommand.UpdateSortRequest? Data { get; set; }
        }

        [HttpPost("UpdateThucDonSort")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateThucDonSort([FromForm] DaTaSort input)
        {
            var dv = GetDonvi();
            var command = input.Data;
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == 1)
                return Ok();
            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }
    }
}
