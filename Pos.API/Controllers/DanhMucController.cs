using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DanhMuc.Commands;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;
using User.API.Application.Features.DanhMuc.Queries;

namespace Pos.API.Controllers
{
    public class DanhMucController : BaseController
    {
        private readonly IMediator _mediator;
        public DanhMucController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
        [HttpGet("{id}", Name ="GetAllDanhMucMatHang")]
        [ProducesResponseType(typeof(M_DanhMuc_MatHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_DanhMuc_MatHang>> GetAllDanhMucMatHang(int id)
        {
            var query = new GetDanhMucListQuery.GetDanhMucQuery(id);
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }

        /// <summary>
        /// Return 0: Don Vi is not exists, 1 save success
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("AddDanhMucMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddDanhMucCommand.AddDanhMucRequest command)
        {
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Tên danh mục đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });

        }
        [HttpPost("UpdateDanhMucMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdateDanhMucMatHangCommand.UpdateDanhMucRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }
        [HttpPost("delete", Name = "DeleteDanhMucMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteDanhMucCommand.DeleteDanhMucRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }
    }
}
