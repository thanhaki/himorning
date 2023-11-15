
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.BaoCao.Queries.DoanhThu;
using Pos.API.Application.Features.BaoCao.Queries.MatHang;
using Pos.API.Application.Features.BaoCao.Queries.TaiChinh;
using Pos.API.Application.Features.Outlet.Commands;
using Pos.API.Application.Features.Outlet.Queries.GetOutletQueries;
using Pos.API.Application.Features.Table.Commands;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using Pos.API.Models.BaoCao;
using System;
using System.Net;

namespace Pos.API.Controllers
{
    [Route("api/baocao")]
    [ApiController]
    public class BaocaoController : BaseController
    {
        private readonly IMediator _mediator;
        public BaocaoController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPost("doanhthutongquan")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDoanhThuTongQuan(GetBaoCaoDoanhThuTongQuan.TongQuanRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }
        
        [HttpPost("doanhthuHttt")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDoanhThuHTTT(GetBaoCaoDoanhThuHTTT.HtttRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("doanhthuThuNgan")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDoanhThuThuNgan(GetBaoCaoDoanhThuThuNgan.ThuNganRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("doanhthuPhucVu")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDoanhThuPhucVu(GetBaoCaoDoanhThuPhucVu.PhucVuRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("doanhthuloaiDH")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDoanhThuLoaiDH(GetBaoCaoDoanhThuLoaiDH.LoaiHDRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("doanhthuHuyDH")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDoanhThuHuyDH(GetBaoCaoDoanhThuDHHuy.DHHuyRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("danhmuc-mathang")]
        [ProducesResponseType(typeof(DanhMucMatHangResponse), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDanhMucMatHang(GetBaoCaoDanhMuc.DanhMucRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("mathang-banchay")]
        [ProducesResponseType(typeof(MatHangBanChayResponse), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetMatHangBanChay(GetBaoCaoMatHangBanChay.MHBanChayRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("mathang-dahuy")]
        [ProducesResponseType(typeof(MatHangDaHuyResponse), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetMatHangDaHuy(GetBaoCaoMatHangHuy.MHHuyRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }

        [HttpPost("taichinh-kqkd")]
        [ProducesResponseType(typeof(MatHangDaHuyResponse), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetBaoCaoKetQuaKD(GetBaoCaoKetQuaKD.KQKDRq request)
        {
            request.DonVi = GetDonvi();
            var result = await _mediator.Send(request);
            return Ok(result);
        }
    }
}
