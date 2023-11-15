using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DanhMucThuChi.Commands;
using Pos.API.Application.Features.DanhMucThuChi.Queries;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    [Route("api/DanhMucThuChi")]
    [ApiController]
    public class DanhMucThuChiController : BaseController
    {
        private readonly IMediator _mediator;
        public DanhMucThuChiController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPost("{getAllDanhMucThuChi}", Name = "GetAllDanhMucThuChi")]
        [ProducesResponseType(typeof(M_DanhMuc_ThuChi), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllDanhMucThuChi(GetDanhMucThuChiListQuery.GetDanhMucThuChiQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Return 0: is not exists, 1 save success
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("AddDanhMucThuChi")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddDanhMucThuChiCommand.AddDanhMucThuChiRequest command)
        {
            command.DonVi = GetDonvi();
            var result = await _mediator.Send(command);
            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Danh mục thu chi đã tồn tại trong đơn vị này, vui lòng kiểm tra lại" });
            }
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Xảy ra lỗi khi thêm danh muc thu chi, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }

        [HttpPost("UpdateDanhMucThuChi")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateDanhMucThuChiById(UpdateDanhMucThuChiCommand.UpdateDanhMucThuChiRequest command)
        {
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("DeleteDanhMucThuChi")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteDanhMucThuChiCommand.DeleteDanhMucThuChiRequest command)
        {
            await _mediator.Send(command);
            return Ok();
        }
    }
}
