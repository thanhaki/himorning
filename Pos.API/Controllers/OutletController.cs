
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.Outlet.Commands;
using Pos.API.Application.Features.Outlet.Queries.GetOutletQueries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    [Route("api/outlet")]
    [ApiController]
    public class OutletController : BaseController
    {
        private readonly IMediator _mediator;
        public OutletController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }


        [HttpGet("", Name = "GetAllOutletByDonVi")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllOutletByDonVi()
        {
            int donVi = GetDonvi();
            var command = new GetOutletQueries.GetAllOutleQueries(donVi);
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost()]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddOutlet(AddOutletCommand.AddOutletRequest request)
        {
            var result = await _mediator.Send(request);
            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Tên outlet đã tồn tại trong đơn vị này, vui lòng kiểm tra lại" });
            }
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Xảy ra lỗi khi thêm khu vực, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }


        [HttpPost("delete")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteOutlet(DeleteOutletCommand.DeleteRequest request)
        {
            var result = await _mediator.Send(request);
            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Outlet không tồn tại, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }

        [HttpPost("AddTableToOutlet")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddTableToOutlet(AddTableToOutletCommand.AddTableRequest request)
        {
            var result = await _mediator.Send(request);
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                                        new ResponseBase { Status = "Error", Message = "Xảy ra lỗi khi thêm khu vực, vui lòng kiểm tra lại" });
            }
            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                                        new ResponseBase { Status = "Error", Message = "Outlet không tồn tại, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }


        [HttpPost("GetOutletById", Name = "GetOutletById")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetOutletById(GetOutletById.OutletReq command)
        {
            command.DonVi = GetDonvi();
            var result = await _mediator.Send(command);
            if (result == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Outlet không tồn tại, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }
    }
}
