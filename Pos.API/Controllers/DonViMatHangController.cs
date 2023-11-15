using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DanhMuc.Commands;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Features.DonViMatHang.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class DonViMatHangController : BaseController
    {
        private readonly IMediator _mediator;
        public DonViMatHangController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
        [HttpGet("{id}", Name = "GetAllDonViMatHang")]
        [ProducesResponseType(typeof(M_DonVi_MatHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_DonVi_MatHang>> GetAllMatHang(int id)
        {
            var query = new GetDVMatHangListQuery.Query(id);
            var matHang = await _mediator.Send(query);
            return Ok(matHang);

        }
        [HttpPost("AddDonViMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddDonViMatHangCommand.AddDonViMatHangRequest command)
        {
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên đơn vị đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });

        }
        [HttpPost("UpdateDonViMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateDonViMatHangCommand.UpdateDonViMatHangRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }
        [HttpPost("DeleteDonViMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteDonViMatHangCommand.DeleteDonViMatHangRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }

        //[HttpPost("GetMatHangByDonViId")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
        //[ProducesDefaultResponseType]
        //public async Task<ActionResult> Delete(DeleteDonViMatHangCommand.DeleteDonViMatHangRequest command)
        //{
        //    await _mediator.Send(command);
        //    return Ok();
        //}
    }
}
