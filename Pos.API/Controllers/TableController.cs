
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.Outlet.Commands;
using Pos.API.Application.Features.Outlet.Queries.GetOutletQueries;
using Pos.API.Application.Features.Table.Commands;
using Pos.API.Application.Features.Table.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;
using User.API.Application.Features.DanhMuc.Queries;

namespace Pos.API.Controllers
{
    [Route("api/table")]
    [ApiController]
    public class TableController : BaseController
    {
        private readonly IMediator _mediator;
        public TableController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpGet("GetResultCheckTheSalesGuide/{id}", Name = "GetResultCheckTheSalesGuideQuery")]
        [ProducesResponseType(typeof(int[]), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<int[]>> GetResultCheckTheSalesGuideQuery(int id)
        {
            var query = new CheckTheSalesGuideSection.CheckTheSalesGuide(id);
            var number = await _mediator.Send(query);
            return Ok(number);

        }

        [HttpGet("GetResultCheckTheHRAdministrativeManual/{id}", Name = "GetResultCheckTheHRAdministrativeManualQuery")]
        [ProducesResponseType(typeof(int[]), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<int[]>> GetResultCheckTheHRAdministrativeManualQuery(int id)
        {
            var query = new CheckTheHRAdministrativeManualSection.CheckTheHRAdministrativeManual(id);
            var number = await _mediator.Send(query);
            return Ok(number);

        }

        [HttpGet("GetResultCheckGuideToRevenueAndExpenditure/{id}", Name = "GetResultCheckGuideToRevenueAndExpenditureQuery")]
        [ProducesResponseType(typeof(int[]), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<int[]>> GetResultCheckGuideToRevenueAndExpenditureQuery(int id)
        {
            var query = new CheckGuideToRevenueAndExpenditureSection.CheckGuideToRevenueAndExpenditure(id);
            var number = await _mediator.Send(query);
            return Ok(number);

        }

        [HttpPost("delete")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddOutlet(DeleteTableCommand.DeleteTblRequest request)
        {
            var result = await _mediator.Send(request);
            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Khu vực không tồn tại hoặc đã bị xóa, vui lòng kiểm tra lại" });
            }

            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = string.Format("Bàn {0} không tồn tại , vui lòng kiểm tra lại", request.Id) });
            }

            return Ok(result);
        }

        [HttpPost("update")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateTable(UpdateTableCommand.UpdateTblRequest request)
        {
            var result = await _mediator.Send(request);
            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Khu vực không tồn tại hoặc đã bị xóa, vui lòng kiểm tra lại" });
            }

            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = string.Format("Bàn {0} , vui lòng kiểm tra lại", request.Table.Id) });
            }

            return Ok(result);
        }
    }
}
