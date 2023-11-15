using MediatR;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pos.API.Application.Features.MatHang.Commands;
using Pos.API.Application.Features.PhieuThuChi.Commands;
using Pos.API.Application.Features.PhieuThuChi.Queries;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static Pos.API.Constans.CmContext;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Pos.API.Controllers
{
    [Route("api/PhieuThuChi")]
    [ApiController]
    public class PhieuThuChiController : BaseController
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMediator _mediator;
        public PhieuThuChiController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("{getAllPhieuThuChi}", Name = "GetAllPhieuThuChi")]
        [ProducesResponseType(typeof(T_PhieuThuChi), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllPhieuThuChi(GetPhieuThuChiListQuery.GetPhieuThuChiQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Return 0: not exists, 1 save success
        /// Loai_PhieuThuChi 1:  Phiếu thu
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("AddPhieuThu", Name = "AddPhieuThu")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> AddPhieuThu([FromForm] string data, [FromForm] IFormFile file = null)
        {
            var command = JsonConvert.DeserializeObject<AddPhieuThuChiCommand.AddPhieuThuChiRequest>(data);
            command.DonVi = GetDonvi();
            command.NgayLapPhieu = Utilities.GetDateTimeSystem();

            if (file != null)
                command.FileThuChi =  await ProcessFileUpLoadAsync(file, command.DonVi);

            var result = await _mediator.Send(command);
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                new ResponseBase { Status = "Error", Message = "Xảy ra lỗi khi thêm phiếu thu chi, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }

        private async Task<string> ProcessFileUpLoadAsync(IFormFile file, int donVi)
        {
            string contentRootPath = _webHostEnvironment.ContentRootPath;

            string folder = Utilities.GetString("UploadPhieuThuChi:PathPhieuThuFile");
            string requestPath = Utilities.GetString("UploadPhieuThuChi:RequestPhieuThuPath");

            string FilePath = Path.Combine(contentRootPath + folder + donVi);
            string fileName = await UploadFileImage(file, FilePath);
            string imgSrc = string.Format("{0}://{1}{2}{3}/{4}/{5}", Request.Scheme, Request.Host, Request.PathBase, requestPath, donVi.ToString(), fileName);
            return imgSrc;
        }

        [HttpPost("DeletePhieuThuChi")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeletePhieuThuChiCommand.DeletePhieuThuChiRequest command)
        {
            await _mediator.Send(command);
            return Ok();
        }

        /// <summary>
        /// Return 0: not exists, 1 save success
        /// Loai_PhieuThuChi 1:  Phiếu thu
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("UpdatePhieuThuChi", Name = "UpdatePhieuThuChi")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdatePhieuThuChi([FromForm] string data, [FromForm] IFormFile file = null)
        {
            var command = JsonConvert.DeserializeObject<UpdatePhieuThuChiCommand.UpdatePhieuThuChiRequest>(data);
            command.DonVi = GetDonvi();
            command.NgayLapPhieu = Utilities.GetDateTimeSystem();

            if (file != null)
                command.FileThuChi = await ProcessFileUpLoadAsync(file, command.DonVi);

            var result = await _mediator.Send(command);
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                new ResponseBase { Status = "Error", Message = "Xảy ra lỗi khi update thông tin phiếu thu chi, vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }

    }
}
