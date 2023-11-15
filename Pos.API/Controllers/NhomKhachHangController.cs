using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DanhMucThuChi.Queries;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Features.KhachHang.Commands;
using Pos.API.Application.Features.NhomKhachHang.Commands;
using Pos.API.Application.Features.NhomKhachHang.Queries;
using Pos.API.Application.Features.ThucDon.Queries;
using Pos.API.Application.Features.VaiTroNhanVien.Queries;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class NhomKhachHangController : BaseController
    {
        private readonly IMediator _mediator;
        public NhomKhachHangController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        }
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(M_Nhom_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_Nhom_KhachHang>> GetAllNhomKhachHang(int id)
        {
            var reques = new GetAllNhomkhachHangQuery.NhomkhachHangQuery(id);
            var result = await _mediator.Send(reques);
            return Ok(result);

        }

        [HttpPost("AddNhomKhachHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddNhomKhachHangCommand.AddNhomKhachHangRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên nhóm khách hàng đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("UpdateNhomKhachHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateNhomKhachHangCommand.UpdateNhomKhachHangRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("DeleteNhomKhachHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteNhomKhachHangCommand.DeleteNhomKhachHangRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("GetKhachHangIsCheckByIdNhom")]
        [ProducesResponseType(typeof(MatHangModelRespose), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetKhachHangIsCheckByIdNhom(GetKhachHangIsCheckByIdNhom.GetKhachHangToCheck query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }
        [HttpPost("UpdateKhachHangByIdNhom")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateKhachHangByIdNhom.UpdateKhachHangByIRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }
        
    }
}
