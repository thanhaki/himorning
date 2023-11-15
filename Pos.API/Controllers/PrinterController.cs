using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.Printer.Commands;
using Pos.API.Application.Features.Printer.Queries;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    [Route("api/printer")]
    [ApiController]
    public class PrinterController : BaseController
    {
        private readonly IMediator _mediator;
        public PrinterController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpGet("{id}", Name = "GetAllPrinter")]
        [ProducesResponseType(typeof(M_Printer), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllPrinter(int id)
        {
            var command = new GetPrinterListQuery.GetPrinterQuery(id);
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        /// <summary>
        /// Return 0: printer is not exists, 1 save success
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("AddPrinter")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddPrinterCommand.AddPrinterRequest command)
        {
            command.DonVi = GetDonvi();
            var result = await _mediator.Send(command);
            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "IP đã tồn tại trong đơn vị này, vui lòng kiểm tra lại" });
            }
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Xảy ra lỗi khi thêm máy in, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }

        [HttpPost("UpdatePrinter")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateMatHangById(UpdatePrinterCommand.UpdatePrinterRequest command)
        {
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("DeletePrinter")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeletePrinterCommand.DeletePrinterRequest command)
        {
            await _mediator.Send(command);
            return Ok();
        }
    }
}
