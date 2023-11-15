using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Features.DonViMatHang.Queries;
using Pos.API.Application.Features.PostBill.Queries;
using Pos.API.Application.Features.ThucDon.Commands;
using Pos.API.Application.Features.ThucDon.Queries;
using Pos.API.Application.Features.ThucDonMatHang.Commands;
using Pos.API.Application.Features.ThucDonMatHang.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;
using User.API.Application.Features.MatHang.Queries;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Pos.API.Controllers
{
    public class ThucDonMatHangController : BaseController
    {
        private readonly IMediator _mediator;
        public ThucDonMatHangController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
        [HttpGet("GetThucDonMatHangByMH/{id}", Name = "GetThucDonMatHangByMH")]
        [ProducesResponseType(typeof(M_ThucDon_MatHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetThucDonMatHangByDonVi(int id)
        {
            int dv = GetDonvi();
            var query = new GetThucDonMatHangByIdMh.ThucDonMHByIdQuery(dv, id);
            var danhM = await _mediator.Send(query);
            return Ok(danhM);
        }

        [HttpPost("AddThucDonMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddThucDonMatHangCommand.AddThucDonMHRequest command)
        {
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Có lỗi trong quá trình xử lý." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });

        }
        //[HttpPost("UpdateThucDon")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
        //[ProducesDefaultResponseType]
        //public async Task<ActionResult> Update(UpdateThucDonCommand.UpdateThucDonRequest command)
        //{
        //    await _mediator.Send(command);
        //    return Ok();
        //}

        [HttpPost("DeleteThucDonMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteThucDonMatHangCommand.DeleteThucDonMHRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }
        [HttpPost("GetMatHangToCheckThucDon")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        [ProducesResponseType(typeof(M_MatHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_MatHang>> GetMatHangToCheckThucDon(GetMatHangToCheckThucDon.GetMatHangToCheck query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var matHang = await _mediator.Send(query);
            return Ok(matHang);

        }
    }
}
