using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.KhachHang.Commands;
using Pos.API.Application.Features.KhachHang.Queries;
using Pos.API.Application.Features.NhanVien.Commands;
using Pos.API.Application.Features.NhomKhachHang.Commands;
using Pos.API.Application.Features.NhomKhachHang.Queries;
using Pos.API.Application.Features.VaiTroNhanVien.Commands;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class KhachHangController : BaseController
    {
        private readonly IMediator _mediator;
        public KhachHangController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        }
        [HttpGet("GetAllKhachHang/{id}", Name = "GetAllKhachHang")]
        [ProducesResponseType(typeof(M_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_KhachHang>> GetAllKhachHang(int id)
        {
            int dv = GetDonvi();
            var reques = new GetListKhachHang.KhachHangQuery(dv, id);
            var result = await _mediator.Send(reques);
            return Ok(result);

        }
        
        [HttpGet("GetListKhByLoaiKH/{id}", Name = "GetListKhByLoaiKH")]
        [ProducesResponseType(typeof(M_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_KhachHang>> GetListKhByLoaiKH(int id)
        {
            int dv = GetDonvi();
            var reques = new GetListKhachHangByLoaiKH.QueryByLoaiKH(dv, id);
            var result = await _mediator.Send(reques);
            return Ok(result);

        }
        
        [HttpGet("GetListKhByLoaiKHThanhToan/{id}", Name = "GetListKhByLoaiKHThanhToan")]
        [ProducesResponseType(typeof(M_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_KhachHang>> GetListKhByLoaiKHThanhToan(int id)
        {
            int dv = GetDonvi();
            var reques = new GetListKHThanhToanTTV.QueryByKHTTV(dv, id);
            var result = await _mediator.Send(reques);
            return Ok(result);

        }

        [HttpPost("AddKhachHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddKhachHangCommand.AddKhachHangRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Số điện thoại khách hàng đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }
        [HttpPost("DeleteKhachHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteKhachHangCommand.DeleteKhachHangRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }
        [HttpPost("GetListKhachHangByIdNhom")]
        [ProducesResponseType(typeof(M_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetListKhachHangByIdNhom(GetListKhachHangByIdNhom.KhachHangQueryById query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }

        [HttpPost("UpdateKhachHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateKhachHangCommand.UpdateKhachHangRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }
        [HttpPost("GetLoaiKhach")]
        [ProducesResponseType(typeof(M_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetListLoaiKhach(GetLoaiKhachHangQuery.LoaiKhachHangQuery query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var loaiKh = await _mediator.Send(query);
            return Ok(loaiKh);
        }

        [HttpGet("GetAllHoaDonKh/{id}", Name = "GetAllHoaDonKh")]
        [ProducesResponseType(typeof(M_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_KhachHang>> GetAllHoaDonKh(int id)
        {
            int dv = GetDonvi();
            var reques = new GetHoaDonKHQuery.HoaDonKHQuery(dv, id);
            var result = await _mediator.Send(reques);
            return Ok(result);
        }

        [HttpGet("GetLichSuTDKH/{id}", Name = "GetLichSuTDKH")]
        [ProducesResponseType(typeof(T_LichSuTichDiem_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<T_LichSuTichDiem_KhachHang>> GetLichSuTDKH(int id)
        {
            int dv = GetDonvi();
            var reques = new GetLichSuTDKHQuery.LichSuTDKHQuery(dv, id);
            var result = await _mediator.Send(reques);
            return Ok(result);
        }
    }
}
