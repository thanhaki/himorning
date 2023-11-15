using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pos.API.Application.Features.DanhMuc.Commands;
using Pos.API.Application.Features.DanhMuc.Queries;
using Pos.API.Application.Features.MatHang.Commands;
using Pos.API.Application.Features.MatHang.Queries;
using Pos.API.Application.Features.NhanVienHeSo.Commands;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using Pos.API.Models.ElectronicMenu;
using System.Collections.Generic;
using System.Net;
using User.API.Application.Features.MatHang.Queries;
using User.API.Application.Features.Users.Queries;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Pos.API.Controllers
{
    [Route("api/mathang")]
    [ApiController]
    public class MatHangController : BaseController
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMediator _mediator;
        public MatHangController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }
        [HttpPost("GetAllMatHang")]
        [ProducesResponseType(typeof(M_MatHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_MatHang>> GetAllMatHang(GetMatHangListQuery.MatHangQuery query)
        {
            var matHang = await _mediator.Send(query);
            return Ok(matHang);

        }
        [HttpPost("AddMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Add([FromForm] string data, [FromForm] IFormFile file = null)
        {
            var command = JsonConvert.DeserializeObject<AddMatHangCommand.AddMatHangRequest>(data);
            command.DonVi = GetDonvi();
            string FilePath = "";
            if (file != null)
            {
                string contentRootPath = _webHostEnvironment.ContentRootPath;

                string folder = Utilities.GetString("UploadMatHang:PathFile");
                string requestPath = Utilities.GetString("UploadMatHang:RequestPath");

                FilePath = Path.Combine(contentRootPath + folder + command.DonVi);
                string fileName = await UploadFileImage(file, FilePath);
                string imgSrc = string.Format("{0}://{1}{2}{3}/{4}/{5}", Request.Scheme, Request.Host, Request.PathBase, requestPath, command.DonVi.ToString(), fileName);
                command.HinhAnh_MH = imgSrc;
            }

            var result = await _mediator.Send(command);

            if (result == 1)
                return Ok();

            // Delete file if save error.
            if (file != null)
            {
                DeleteFile(Path.Combine(FilePath, file.FileName));
            }

            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
               new ResponseBase { Status = "Error", Message = "Tên mặt hàng đã tồn tại." });

            if (result == -2)
                return StatusCode(StatusCodes.Status404NotFound,
               new ResponseBase { Status = "Error", Message = "Mã QR Code đã tồn tại." });

            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }

        [HttpPost("Filter")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> Search(GetMatHangListQuery.MatHangQuery query)
        {
            return Ok(await _mediator.Send(query));
        }
        [HttpPost("GetMatHangByIdDonViMatHang")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetMatHangByIdDonViMatHang(GetMatHangByIdListQuery.MatHangDVQuery query)
        {
            query.DonVi = GetDonvi();
            return Ok(await _mediator.Send(query));
        }
        [HttpPost("UpdateMatHangById")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateMatHangById(UpdateMatHangBy_idDMCommand.UpdateMatHangBy_idRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }
        [HttpPost("DeleteMatHang")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> Delete(DeleteMatHangCommand.DeleteMatHangRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }

        [HttpGet("{id}", Name = "GetLoaiMatHang")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetMatHangByData(int id)
        {
            var query = new GetLoaiMatHangByData.QueryLoaiMatHang(id);
            var loaiMh = await _mediator.Send(query);
            return Ok(loaiMh);
        }

        [HttpPost("UpdateChiTietMatHangById")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateChiTietMatHangById([FromForm] string data, [FromForm] IFormFile file = null)
        {
            var command = JsonConvert.DeserializeObject<UpdateMatHangCommand.UpdateMatHangRequest>(data);
            command.DonVi = GetDonvi();
            string FilePath = "";
            if (file != null)
            {
                string contentRootPath = _webHostEnvironment.ContentRootPath;

                string folder = Utilities.GetString("UploadMatHang:PathFile");
                string requestPath = Utilities.GetString("UploadMatHang:RequestPath");

                FilePath = Path.Combine(contentRootPath + folder + command.DonVi);
                string fileName = await UploadFileImage(file, FilePath);
                string imgSrc = string.Format("{0}://{1}{2}{3}/{4}/{5}", Request.Scheme, Request.Host, Request.PathBase, requestPath, command.DonVi.ToString(), fileName);
                command.HinhAnh_MH = imgSrc;
            }

            var result = await _mediator.Send(command);

            // Delete file if save error.
            if (!string.IsNullOrEmpty(command.ImgOld))
            {
                var imgName = command.ImgOld.Split("/");
                DeleteFile(Path.Combine(FilePath, imgName[imgName.Length - 1]));
            }
            if (result == 1)
                return Ok();


            if (result == -2)
                return StatusCode(StatusCodes.Status404NotFound,
               new ResponseBase { Status = "Error", Message = "Mã QR Code đã tồn tại ở Mặt hàng khác" });


            if (result == -1)
                return StatusCode(StatusCodes.Status404NotFound,
               new ResponseBase { Status = "Error", Message = "Tên mặt hàng đã tồn tại." });


            return StatusCode(StatusCodes.Status404NotFound,
                    new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
        }
        [HttpPost("GetAllProductSearch")]
        [ProducesResponseType(typeof(M_MatHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_MatHang>> GetAllProductSearch(GetAllProductSearch.ProductSearch query)
        {
            var matHang = await _mediator.Send(query);
            return Ok(matHang);
        }

        [HttpPost("GetMatHangByIdMatHang")]
        [ProducesResponseType(typeof(ItemMatHangTD), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetMatHangByIdMatHang(GetMatHangByIdMatHang.QueryByIdMH query)
        {
            query.DonVi = GetDonvi();
            return Ok(await _mediator.Send(query));
        }

        [HttpGet("GetMatHangByIdQRCode/{qrCode}", Name = "GetMatHangByIdQRCode")]
        [ProducesResponseType(typeof(MatHangModelRespose), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetMatHangByIdQRCode(string qrCode)
        {
            var query = new GetMatHangByQRCode.QueryByQRCode(qrCode, GetDonvi());
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
               new ResponseBase { Status = "Error", Message = "Qr Code mặt hàng Không tồn tại." });
            }
            return Ok(result);
        }

        public class DaTaImport
        {
            public ImportProductCommand.ImportProductRequest? Data { get; set; }
        }
        [HttpPost("ImportProduct")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> ImportProduct([FromForm] string data)
        {
            try
            {
                var product = JsonConvert.DeserializeObject<List<ImportProductCommand.ImportProductRequest>>(data);
                product.ToList().ForEach(item => item.DonVi = GetDonvi());
                foreach (var item in product)
                {
                    await _mediator.Send(item);
                }
                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                   new ResponseBase { Status = "Error", Message = "Don vi không tồn tại hoặc chưa đăng ký." });
                throw;
            }
            
           
        }

        [HttpPost("CoppyProduct")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> CoppyProduct(CoppyProductCommand.CoppyMatHangRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }
    }
}
