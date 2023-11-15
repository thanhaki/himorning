using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.KhuyenMai.Commands;
using Pos.API.Application.Features.KhuyenMai.Queries;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class KhuyenMaiController : BaseController
    {
        private readonly IMediator _mediator;
        public KhuyenMaiController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(M_KhuyenMai), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<KhuyenMaiModalResponse>> GetAllKhuyenMai(int id)
        {
            id = GetDonvi();
            var reques = new GetListKhuyenMai.KhuyenMaiQuery(id);
            var result = await _mediator.Send(reques);
            return Ok(result);
        }

        [HttpPost("AddKhuyenMai")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddKhuyenMaiCommand.AddKhuyenMaiRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Khuyến mãi đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Đơn vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("DeleteKhuyenMai")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteKhuyenMaiCommand.DeleteKhuyenMaiRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("GetListKhuyenMaiCheckAD")]
        [ProducesResponseType(typeof(MatHangModelRespose), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetListKhuyenMaiCheckAD(GetListKhuyenMaiIsCheckAd.GetListDSToCheck query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }

        [HttpPost("GetListKhuyenMaiCheckDT")]
        [ProducesResponseType(typeof(MatHangModelRespose), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetListKhuyenMaiCheckDT(GetListKhuyenMaiIsCheckDT.GetListDsDTToCheck query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }

        [HttpPost("UpdateKhuyenMai")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateKhuyenMaiByIdCommand.UpdateKhuyenMaiRequest query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var result =  await _mediator.Send(query);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Xảy ra lỗi, vui lòng kiểm tra lại" });
            if (result == 1)
                return Ok();
            return Ok();
        }

        [HttpPost("GetListTimeKhuyenMai")]
        [ProducesResponseType(typeof(MatHangModelRespose), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetListTimeKhuyenMaiBydId(GetListTimeByIdKhuyenMai.TimeKhuyenMaiQuery query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }
    }
}
