using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.LichSuCongTacNhanVien.Commands;
using Pos.API.Application.Features.LichSuCongTacNhanVien.Queries;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class LichLamViecNhanVienController : BaseController
    {
        private readonly IMediator _mediator;
        public LichLamViecNhanVienController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPost("AddLichLamViec")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddLichLamViecCommand.AddLichSuCongTacRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == 1)
                return Ok();
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tạo mới lịch làm việc không thành công." });
            if (result == -2)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Lịch làm việc có sử thay, vui lòng load lại thông tin lịch làm việc." });
            }
            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });

        }

        [HttpPost("UpdateLichLamViec")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateLichLamViecCommand.UpdateLichCongTacRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("GetAllLichLamViec")]
        [ProducesResponseType(typeof(M_NhanVien), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllLichLamViec(GetLichLamViecNhanVienQueries.LichLamViec query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }
    }
}
