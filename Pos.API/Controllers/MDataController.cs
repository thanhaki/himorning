using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Net;
using System.Security.Claims;
using User.API.Application.Features.MData.Queries;

namespace Pos.API.Controllers
{
    [Route("api/mdata")]
    [ApiController]
    public class MDataController : BaseController
    {
        private readonly IMediator _mediator;
        public MDataController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpGet("getbygroupdata")]
        [ProducesResponseType(typeof(M_Data), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetMDataByGroupData()
        {
            var command = new GetMDataByGroupDataQuery.QueryGroupData();
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("getbygroupdata")]
        [ProducesResponseType(typeof(M_Data), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetMDataByGroupData(GetMDataByGroupNameQuery.RequestGroupData command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
