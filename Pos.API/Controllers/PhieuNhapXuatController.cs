using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pos.API.Application.Features.PhieuNhapXuat.Commands;
using Pos.API.Application.Features.PhieuNhapXuat.Queries;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class PhieuNhapXuatController : BaseController
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMediator _mediator;
        public PhieuNhapXuatController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _webHostEnvironment = webHostEnvironment;

        }
        [HttpPost("AddPhieuNhapXuat")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add([FromForm] string data, [FromForm] IFormFile file = null)
        {
            var command = JsonConvert.DeserializeObject<AddPhieuNhapXuatCommand.PhieuNXRequest>(data);
            command.DonVi = GetDonvi();
            command.NgayLap_Phieu = Utilities.GetDateTimeSystem();

            if (file != null)
                command.MieuTaFile = await ProcessFileUpLoadAsync(file, command.DonVi);

            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Phiếu nhập xuất đã tồn tại." });
            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Đơn vi không tồn tại hoặc chưa đăng ký." });
        }
        private async Task<string> ProcessFileUpLoadAsync(IFormFile file, int donVi)
        {
            string contentRootPath = _webHostEnvironment.ContentRootPath;

            string folder = Utilities.GetString("UploadPhieuNhapXuat:PathPhieuNhapXFile");
            string requestPath = Utilities.GetString("UploadPhieuNhapXuat:RequestPhieuNhapXPath");

            string FilePath = Path.Combine(contentRootPath + folder + donVi);
            string fileName = await UploadFileImage(file, FilePath);
            string imgSrc = string.Format("{0}://{1}{2}{3}/{4}/{5}", Request.Scheme, Request.Host, Request.PathBase, requestPath, donVi.ToString(), fileName);
            return imgSrc;
        }

        [HttpPost("GetLoaiPhieuByType")]
        [ProducesResponseType(typeof(M_KhuyenMai), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(M_Data), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDataLoaiPhieu(GetLoaiPhieuQuery.LoaiPhieuQuery data)
        {
            int dv = GetDonvi();
            data.DonVi = dv;
            var result = await _mediator.Send(data);
            return Ok(result);
        }

        [HttpPost("UpdatePhieuNhapX")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Update(UpdatePhieuNhapXuatCommand.UpdatePhieuNXRequest query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            await _mediator.Send(query);
            return Ok();
        }
        [HttpPost("GetAllPhieuNhapXuat")]
        [ProducesResponseType(typeof(T_PhieuNhapXuat), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllPhieuNhapXuat(GetListLoaiPhieuNhapXuatQueries.LoaiPhieuNXQuery query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }

        [HttpPost("GetCTPKiemKe")]
        [ProducesResponseType(typeof(T_PhieuNhapXuat_ChiTiet), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetChiTietPhieuKiemKe(GetChiTietPhieuKiemKeQuery.PhieuKiemKeCT query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);
        }
        [HttpPost("GetAllProduct")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllProduct(GetAllProductQuery.ProductQuery query)
        {
            return Ok(await _mediator.Send(query));
        }
        [HttpPost("GetChiTietPhieu")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetChiTietPhieuNhapX(GetChiTietPhieuNhapXQuery.PhieuNhapXuatCT query)
        {
            return Ok(await _mediator.Send(query));
        }
        [HttpPost("GetSoLuongProduct")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<DonViModelResponse>> GetSoLuongProduct(GetAllProductKiemKe.ProductById request)
        {
            return Ok(await _mediator.Send(request));
        }
        [HttpPost("UpdateTrangThai")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateTrangThaiPhieu(UpdateTrangThaiPhieuCommand.UpdateTrangThaiRequest query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            await _mediator.Send(query);
            return Ok();
        }
    }
}
