using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pos.API.Common;
using Pos.API.Controllers;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;
using User.API.Application.Features.DonVi.Commands;
using User.API.Application.Features.Users.Queries;

namespace User.API.Controllers
{
    public class DonViController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public DonViController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<DonViModelResponse>> GetAllDonVi(GetDonViListQuery.QueryRequest query)
        {
            var donVi = await _mediator.Send(query);
            return Ok(donVi);
        }

        [AllowAnonymous]
        [HttpPost(Name = "AddDonVi")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add(AddDonViCommand.AddDonViRequest command)
        {
            var result = await _mediator.Send(command);
            if (result == 1)
            {
                return StatusCode(StatusCodes.Status200OK, new ResponseBase { Status = "Success", Message = "Đăng ký thành công" });
            }

            if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                     new ResponseBase { Status = "Error", Message = "Email/Số điện thoại đã được đăng ký, vui lòng đăng nhập" });
            }

            return StatusCode(StatusCodes.Status404NotFound,
                                     new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình đăng ký, vui lòng thử lại." });
        }

        [HttpPost("delete")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteDonViCommand.DeleteDonViRequest command)
        {
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("approved")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Approved(ApprovedDonViCommand.ApprovedDonViRequest command)
        {
            var result = await _mediator.Send(command);
            if (result == 1) { return Ok(); }
            return StatusCode(StatusCodes.Status404NotFound,
                                                new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình xác nhận, vui lòng thử lại." });
        }

        [HttpPost("updateTinhTrang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateTinhTrang(UpdateTinhTrangDonViCommand.UpdateTinhTrangRequest command)
        {
            var result = await _mediator.Send(command);
            if (result == 1) { return Ok(); }
            return StatusCode(StatusCodes.Status404NotFound,
                                                new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình cập nhật, vui lòng thử lại." });
        }

        [HttpPost("updateSupporter")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateSupporter(UpdateSupporterDonViCommand.UpdateSupporterDVRequest command)
        {
            var result = await _mediator.Send(command);
            if (result == 1) { return Ok(); }
            return StatusCode(StatusCodes.Status404NotFound,
                                                new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình cập nhật, vui lòng thử lại." });
        }

        [HttpGet("{id}", Name = "GetDonViById")]
        [ProducesResponseType(typeof(M_DonVi), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_DonVi>> GetPermissionByCode(int id)
        {
            var query = new GetDonViById.QueryRequestId(id);
            var permission = await _mediator.Send(query);
            return Ok(permission);
        }

        [HttpPut(Name = "UpdateDonVi")]
        [ProducesResponseType(typeof(M_DonVi), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_DonVi>> UpdateDonVi(UpdateDonViCommand.DonViRequest command)
        {
            var reslt = await _mediator.Send(command);
            if (reslt == 1) { return Ok(); }

            return StatusCode(StatusCodes.Status404NotFound,
                new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình cập nhật, vui lòng thử lại." });
        }

        [HttpPost("update-image-unit")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateImageDonVi([FromForm] string data,[FromForm] IFormFile? File)
        {
            var command = JsonConvert.DeserializeObject<UpdateImageDonViCommand.ImageRequest>(data);
            command.DonVi = GetDonvi();

            string FilePath = "";

            string contentRootPath = _webHostEnvironment.ContentRootPath;
            string folder = Utilities.GetString("UploadImageDonVi:PathFile");

            FilePath = Path.Combine(contentRootPath + folder + command.DonVi);
            string requestPath = Utilities.GetString("UploadImageDonVi:PathAccess");

            if (File != null)
            {
                switch (command.FileName)
                {
                    case "LOGO":
                        command.LogoDonVi = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.LogoDonVi);
                        break;
                    case "COVER1":
                        command.AnhBiaPCDonVi = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.AnhBiaPCDonVi);

                        break;
                    case "COVER2":
                        command.AnhBiaIPDonVi = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.AnhBiaIPDonVi);

                        break;
                    case "COVER3":
                        command.AnhBiaSPDonVi = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.AnhBiaSPDonVi);
                        break;
                    default:
                        command.AnhNganHang = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.AnhNganHang);
                        break;
                }
            }


            var result = await _mediator.Send(command);
            if (result == 1) { return Ok(); }
            return StatusCode(StatusCodes.Status404NotFound,
                                                new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình cập nhật, vui lòng thử lại." });
        }

        [HttpGet("get-ngon-ngu/{id}", Name = "getNgonNguTheoNganHang")]
        [ProducesResponseType(typeof(LanguageModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<LanguageModelResponse>> GetNgonNguTheoNganHang(int id)
        {
            int dv = GetDonvi();
            var query = new GetNgonNguTheoNganHang.LangageQuery(id, dv);
            var permission = await _mediator.Send(query);
            return Ok(permission);
        }

        [HttpPost("update-ngon-ngu", Name = "UpdateNgonNguTheoNganHang")]
        [ProducesResponseType(typeof(LanguageModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<LanguageModelResponse>> UpdateNgonNguTheoNganHang(UpdateNgonNguCommand.UpdateLanguage command)
        {
            var permission = await _mediator.Send(command);
            return Ok(permission);
        }
    }
}