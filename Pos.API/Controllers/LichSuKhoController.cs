using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.LichSuMatHang.Queries;
using Pos.API.Domain.Entities;
using System.Net;

namespace Pos.API.Controllers
{
    public class LichSuKhoController : BaseController
    {
        private readonly IMediator _mediator;
        public LichSuKhoController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPost("GetAllLichSuKho")]
        [ProducesResponseType(typeof(T_PhieuNhapXuat), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllLichSuMatHang(GetAllLichSuMatHangQuery.LichSuMhQuery query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var lichSu = await _mediator.Send(query);
            return Ok(lichSu);

        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetListDanhSachTonKho(int id)
        {
            var reques = new GetListDanhSachTonKhoQuery.TonKhoQuery(id);
            var result = await _mediator.Send(reques);
            return Ok(result);
        }

        [HttpPost("GetFilterMatHangKho")]
        public async Task<ActionResult> GetFilterMatHangKho(GetFilterMatHangToKho.FilterMhKhoQuery query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var filter = await _mediator.Send(query);
            return Ok(filter);

        }
    }
}
