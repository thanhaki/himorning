
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pos.API.Application.Features.ElectronicMenu.Queries;
using Pos.API.Application.Features.KhuyenMai.Queries;
using Pos.API.Application.Features.Outlet.Commands;
using Pos.API.Application.Features.Outlet.Queries.GetOutletQueries;
using Pos.API.Application.Features.Table.Commands;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using Pos.API.Models.ElectronicMenu;
using System.Net;
using User.API.Application.Features.DonVi.Commands;
using User.API.Application.Features.ElectronicMenu.Commands;
using User.API.Application.Features.MatHang.Queries;

namespace Pos.API.Controllers
{
    [Route("api/electronic-menu")]
    [ApiController]
    public class ElectronicMenuController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ElectronicMenuController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("update-description-production")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateImageDonVi([FromForm] string data, [FromForm] IFormFile? File)
        {
            var command = JsonConvert.DeserializeObject<UpdateDescriptionProductCommand.DescriptionReq>(data);
            //command.DonVi = 1;

            string FilePath = "";

            string contentRootPath = _webHostEnvironment.ContentRootPath;

            string folder = Utilities.GetString("UploadMatHang:PathFile");
            string requestPath = Utilities.GetString("UploadMatHang:RequestPath");

            FilePath = Path.Combine(contentRootPath + folder + command.DonVi + "//" + "mat-hang-" + command.Ma_MH);
            if (File != null)
            {
                switch (command.FileName)
                {
                    case "IMAG1":
                        command.HinhAnh_ChiaSe = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_ChiaSe, command.Ma_MH);
                        break;

                    case "IMAG2":
                        command.HinhAnh_MH01 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH01, command.Ma_MH);
                        break;
                    case "VIDEO":
                        command.Video_MH = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.Video_MH, command.Ma_MH);
                        break;

                    case "IMAG3":
                        command.HinhAnh_MH02 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH02, command.Ma_MH);
                        break;

                    case "IMAG4":
                        command.HinhAnh_MH03 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH03, command.Ma_MH);
                        break;

                    case "IMAG5":
                        command.HinhAnh_MH04 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH04, command.Ma_MH);
                        break;

                    case "IMAG6":
                        command.HinhAnh_MH05 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH05, command.Ma_MH);
                        break;

                    case "IMAG7":
                        command.HinhAnh_MH06 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH06, command.Ma_MH);
                        break;

                    case "IMAG8":
                        command.HinhAnh_MH07 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH07, command.Ma_MH);
                        break;

                    case "IMAG9":
                        command.HinhAnh_MH08 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH08, command.Ma_MH);
                        break;

                    case "IMAG10":
                        command.HinhAnh_MH09 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH09, command.Ma_MH);
                        break;

                    case "IMAG11":
                        command.HinhAnh_MH10 = await ReturnFileNameAsync(File, FilePath, requestPath, command.DonVi, command.HinhAnh_MH10, command.Ma_MH);
                        break;
                }
                //check size video
                //long fileSize = Files[1].Length;
                //if (fileSize > (10 * 1000000))
                //{
                //    return StatusCode(StatusCodes.Status404NotFound,
                //                                        new ResponseBase { Status = "Error", Message = "Video (nhỏ hơn <10mb và kéo dài tối đa 30 giây)" });
                //}


            }


            var result = await _mediator.Send(command);
            if (result == 1) { return Ok(); }
            if (result == -1)
            {
                StatusCode(StatusCodes.Status404NotFound,
                                                new ResponseBase { Status = "Error", Message = "Mặt hàng không tồn tại." });
            }
            return StatusCode(StatusCodes.Status404NotFound,
                                                new ResponseBase { Status = "Error", Message = "Đã có lỗi trong quá trình cập nhật, vui lòng thử lại." });
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ListThucDons), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<ListThucDons>> GetAllThucDonMatHang(int id)
        {
            var reques = new GetAllThucDonMatHang.ThucDonQuery(id);
            var result = await _mediator.Send(reques);
            return Ok(result);
        }
        [AllowAnonymous]
        [HttpPost("GetMatHangByIdMatHang")]
        [ProducesResponseType(typeof(ItemMatHangTD), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetMatHangByIdMatHang(GetMatHangByIdMatHang.QueryByIdMH query)
        {
            return Ok(await _mediator.Send(query));
        }

        [AllowAnonymous]
        [HttpPost("update-file")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UploadFile([FromForm] IFormFile? upload)
        {
            string FilePath = "";

            string contentRootPath = _webHostEnvironment.ContentRootPath;
            string folder = Utilities.GetString("UploadImageCkEditor:PathFile");

            FilePath = Path.Combine(contentRootPath + folder);
            string requestPath = Utilities.GetString("UploadImageCkEditor:PathAccess");

            string pth = await ReturnFileNameAsync(upload,FilePath, requestPath,0,"");

            return Ok(new UploadResponse
            {
                Url = pth
            });
        }
    }
}
