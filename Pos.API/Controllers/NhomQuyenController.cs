using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Features.DonViMatHang.Queries;
using Pos.API.Application.Features.VaiTroNhanVien.Commands;
using Pos.API.Application.Features.VaiTroNhanVien.Queries;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class NhomQuyenController : BaseController
    {
        private readonly IMediator _mediator;

        public NhomQuyenController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(M_NhomQuyen), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_NhomQuyen>> GetAllNhomQuyen(int id)
        {
            //var dv = GetDonvi();
            //reques.DonVi = dv;
            var reques = new GetNhomQuyenListQuery.NhomQuyenQuery(id);
            var result = await _mediator.Send(reques);
            return Ok(result);

        }

        [HttpPost("AddNhomQuyen")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddNhomQuyenCommand.AddNhomQuyenRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên nhóm quyền đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("GetDataByGroupChucNang")]
        [ProducesResponseType(typeof(M_Data), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetMDataByGroupChucNang(GetAllNhomQuyenByIdDataQuery.NhomQuyenByIdDataQuery data)
        {
            return Ok(await _mediator.Send(data));
        }
        [HttpPost("DeleteNhomQuyen")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteNhomQuyenCommand.DeleteNhomQuyenRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }
        [HttpPost("GetAllNhomQuyenByIdData")]
        [ProducesResponseType(typeof(M_NhomQuyen), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllNhomQuyenByIdData(GetAllNhomQuyenByIdDataQuery.NhomQuyenByIdDataQuery reques)
        {
            int dv = GetDonvi();
            reques.DonVi = dv;
            var result = await _mediator.Send(reques);
            return Ok(result);
        }
    }
}