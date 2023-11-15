using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.KhachHang.Commands;
using Pos.API.Application.Features.KhachHang.Queries;
using Pos.API.Application.Features.NhomKhachHang.Commands;
using Pos.API.Application.Features.NhomKhachHang.Queries;
using Pos.API.Application.Features.TheThanhVien.Commands;
using Pos.API.Application.Features.TheThanhVien.Queries;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class TheThanhVienController : BaseController
    {
        private readonly IMediator _mediator;
        public TheThanhVienController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(M_TheThanhVien), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_TheThanhVien>> GetAllTheThanhVien(int id)
        {
            var reques = new GetListTheThanhVien.TheThanhVienQuery(id);
            var result = await _mediator.Send(reques);
            return Ok(result);

        }

        [HttpPost("AddTheThanhVien")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddTheThanhVienCommand.AddTheThanhVienRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Thẻ thành viên đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Đơn vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("DeleteTheTV")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteTheThanhVienCommand.DeleteTheThanhVienRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("UpdateTheTV")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateTheThanhVienCommand.UpdateTheThanhVienRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("GetKhachHangIsCheckByIdThe")]
        [ProducesResponseType(typeof(TheThanhVienModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetKhachHangIsCheckByIdThe(GetAllKhachHangIsCheckByIdThe.KhachHangToCheck query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }
        [HttpPost("UpdateKhachHangByIdThe")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateTheKhachHangByIdThe.UpdateTheKHByIRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("GetKhachHangByIdThe")]
        [ProducesResponseType(typeof(TheThanhVienModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetKhachHangByIdThe(GetKhachHangByIdThe.GetKhachHangByIdQuery query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);
        }
    }
}
