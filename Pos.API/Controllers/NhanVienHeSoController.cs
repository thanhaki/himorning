using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.NhanVienHeSo.Commands;
using Pos.API.Application.Features.NhanVienHeSo.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class NhanVienHeSoController : BaseController
    {
        private readonly IMediator _mediator;
        public NhanVienHeSoController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

        }
     
        [HttpPost("GetAllHeSoNhanVien")]
        [ProducesResponseType(typeof(T_PhieuNhapXuat), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetListHeSoNhanVien(GetListHeSoNhanVienQuery.HeSoNhanVien query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var listHeSoNv = await _mediator.Send(query);
            return Ok(listHeSoNv);

        }

        [HttpPost("AddNhanVienHeSo")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddNhanVienHeSoCommand.AddNhanVienHeSoCoRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Hồ Sơ nhân viên đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }
    }
}
