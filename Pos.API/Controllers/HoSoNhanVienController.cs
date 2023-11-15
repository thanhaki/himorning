using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pos.API.Application.Features.NhanVienHeSo.Commands;
using Pos.API.Application.Features.NhanVienHeSo.Queries;
using Pos.API.Application.Features.NhanVienHoSo.Commands;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;

namespace Pos.API.Controllers
{
    public class DaTaHoSoNhanVien
    {
        public AddHoSoNhanVienCommand.AddHoSoNVRequest? Data { get; set; }
        public List<IFormFile>? File { get; set; }
    }
    public class HoSoNhanVienController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public HoSoNhanVienController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _webHostEnvironment = webHostEnvironment;

        }

        [HttpPost("AddHoSoNhanVien")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add([FromForm] DaTaHoSoNhanVien input)
        {
            var file = input.File;
            var command = input.Data;
            if (command == null) {
                new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình lưu, vui lòng thử lại." };
            }

            command.DonVi = GetDonvi();
            if (file != null && command.ListFile !=null && command.ListFile.Count == file.Count)
            {
                for (var i = 0; i < file.Count; i++)
                {
                    command.ListFile[i].File_URL = await ProcessFileUpLoadAsync(file[i], command.DonVi);
                }
            }
            var result = await _mediator.Send(command);
            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Thêm mới hồ sơ nhân viên không thành công." });

            if (result == 1)
                return Ok();

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Đơn vi không tồn tại hoặc chưa đăng ký." });
        }
        private async Task<string> ProcessFileUpLoadAsync(IFormFile file, int donVi)
        {
            string contentRootPath = _webHostEnvironment.ContentRootPath;

            string folder = Utilities.GetString("UploadHoSoNhanVien:PathHoSoNVFile");
            string requestPath = Utilities.GetString("UploadHoSoNhanVien:RequestHoSoNVPath");

            string FilePath = Path.Combine(contentRootPath + folder + donVi);
            string fileName = await UploadFileImage(file, FilePath);
            //string imgSrc = string.Format("{0}/{1}/{2}", requestPath, donVi.ToString(), fileName);
            string imgSrc = string.Format("{0}://{1}{2}{3}/{4}/{5}", Request.Scheme, Request.Host, Request.PathBase, requestPath, donVi.ToString(), fileName);
            return imgSrc;
        }

        [HttpPost("GetAllHoSoNhanVien")]
        [ProducesResponseType(typeof(M_NhanVien), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllHoSoNhanVien(GetListHoSoNhanVienQuery.HoSoNhanVien query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var danhM = await _mediator.Send(query);
            return Ok(danhM);

        }
        [HttpPost("GetLoaiPbTinhTrang")]
        [ProducesResponseType(typeof(M_Data), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDataLoaiPhieu(GetLoaiPhongBan_TinhTrang.LoaiPbTinhTrang data)
        {
            int dv = GetDonvi();
            data.DonVi = dv;
            var result = await _mediator.Send(data);
            return Ok(result);
        }

        [HttpPost("GetChiTietHoSoNV")]
        [ProducesResponseType(typeof(M_NhanVien_HoSo), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetChiTietHoSoNV(GetListChiTietHoSoNVQuery.HoSoNhanVienCT data)
        {
            int dv = GetDonvi();
            data.DonVi = dv;
            var result = await _mediator.Send(data);
            return Ok(result);
        }

        [HttpPost("DeleteHoSoNV")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteHoSoNVCommand.DeleteHoSoNVRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("DeleteChiTietHoSoNV")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> DeleteChiTietHoSoNV(DeleteChiTietHoSoNVCommand.DeleteCTHoSoNVRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            await _mediator.Send(command);
            return Ok();
        }
    }
}
