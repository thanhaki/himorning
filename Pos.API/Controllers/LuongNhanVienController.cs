using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.LuongNhanVien.Commands;
using Pos.API.Application.Features.LuongNhanVien.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class LuongNhanVienController : BaseController
    {
        private readonly IMediator _mediator;
        public LuongNhanVienController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPost("GetAllLuongNhanVien")]
        [ProducesResponseType(typeof(M_NhanVien), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllLuongNhanVien(GetListSearchSalaryQueries.LuongNhanVien query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var salary = await _mediator.Send(query);
            return Ok(salary);

        }

        [HttpPost("UpdateLuongNhanVien")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateLuong(UpdateLuongNhanVienCommand.UpdateLuongNVRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình lưu, vui lòng thử lại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("LuongNhanVienById")]
        [ProducesResponseType(typeof(M_NhanVien), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> LuongNhanVienById(GetLuongNhanVienByIdQueries.QueryBydId query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var list = await _mediator.Send(query);
            return Ok(list);

        }
    }
}
