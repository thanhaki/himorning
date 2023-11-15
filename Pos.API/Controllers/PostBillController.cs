using MediatR;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using NReco.PdfGenerator;
using Pos.API.Application.Features.DonHang.Commands;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Features.PostBill.Commands;
using Pos.API.Application.Features.PostBill.Commands.VnPay;
using Pos.API.Application.Features.PostBill.Queries;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Net;
using System.Net.Sockets;
using System.Security.Claims;
using System.Xml.Linq;
using User.API.Application.Features.DonHang.Queries;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static Pos.API.Application.Features.PostBill.Commands.UpdateBillTamTinhCommand;

namespace Pos.API.Controllers
{
    [Route("api/postbill")]
    [ApiController]
    public class PostBillController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IVnPayService _vnPayService;

        public PostBillController(IVnPayService vnPayService, IMediator mediator)
        {
            _vnPayService = vnPayService;
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpGet("{id}", Name = "GetThucDonMatHangByDonVi")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetThucDonMatHangByDonVi(int id)
        {
            var query = new GetThucDonMatHangQueryByDonVi.GetThucDonRequest(id);
            var danhM = await _mediator.Send(query);
            return Ok(danhM);
        }

        [HttpGet("getalluser", Name = "GetAllEmployeeDonVi")]
        [ProducesResponseType(typeof(UserModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllEmployeeDonVi()
        {
            int dv = GetDonvi();
            var query = new GetAllUserByDonViQuery.QueryUserDv(dv);
            var danhM = await _mediator.Send(query);
            return Ok(danhM);
        }

        [HttpGet("loaidonhang/{id}", Name = "GetLoaiDonHangQuery")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetLoaiDonHangQuery(int id)
        {
            var query = new GetLoaiDonHangQuery.QueryLoaiDonHang(id);
            var danhM = await _mediator.Send(query);
            return Ok(danhM);
        }

        [HttpPost("createorder", Name = "CreateOrder")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> CreateOrder(AddDonHangCommand.AddDonHangRequest request)
        {
            int dv = GetDonvi();
            request.DonVi = dv;
            request.UserName = GetUsername();
            var result = await _mediator.Send(request);
            
            if (result.Status == "-2")
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = result.Message });
            }

            if (result.Status == "-1")
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = result.Message });
            }

            if (result.Status == "0")
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = result.Message });
            }

            if (result.Status == "2")
            {
                return StatusCode(StatusCodes.Status200OK,
                                        new ResponseBase { Status = result.Status, Message = result.Message });
            }
            return Ok(result);
        }

        [HttpPost("gettableordered", Name = "GetTableOrdered")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetTableOrdered(GetTableOrderedByTableNo.QueryOrderedTableNo query)
        {
            int dv = GetDonvi();
            query.DonVi = dv;
            var result = await _mediator.Send(query);
            return Ok(result);
        }


        [HttpPost("payment", Name = "PaymentOrder")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> PaymentOrder(PaymentCommand.PaymentRequest request)
        {
            int dv = GetDonvi();
            request.DonVi = dv;
            request.UserName = GetUsername();
            var result = await _mediator.Send(request);
            if (result == "-1")
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Đơn hàng không tồn tại" });
            }

            if (result == "-2")
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Đơn hàng đã thanh toán, vui lòng kiểm tra lại." });
            }

            if (result == "0")
            {
                return StatusCode(StatusCodes.Status404NotFound,
                                        new ResponseBase { Status = "Error", Message = "Thanh toán không thành công, Vui lòng kiểm tra lại" });
            }
            return Ok(result);
        }

        [HttpPost("VnpayQr")]
        public IActionResult CreatePaymentUrl(PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Ok(url);
        }

        [HttpPost("PaymentCallback")]
        public IActionResult PaymentCallback(TxnRefKeyModel query)
        {
            // Tạo một bản sao của IQueryCollection và thêm giá trị và key từ model vào đó
            var values = new Dictionary<string, StringValues>
            {
                { "vnp_Amount", query.vnp_Amount },
                { "vnp_BankCode", query.vnp_BankCode },
                { "vnp_BankTranNo", query.vnp_BankTranNo },
                { "vnp_CardType", query.vnp_CardType },
                { "vnp_OrderInfo", query.vnp_OrderInfo },
                { "vnp_PayDate", query.vnp_PayDate },
                { "vnp_ResponseCode", query.vnp_ResponseCode },
                { "vnp_TmnCode", query.vnp_TmnCode },
                { "vnp_TransactionNo", query.vnp_TransactionNo },
                { "vnp_TransactionStatus", query.vnp_TransactionStatus },
                { "vnp_TxnRef", query.vnp_TxnRef },
                { "vnp_SecureHash", query.vnp_SecureHash },
            };
            var updatedQuery = new QueryCollection(values);

            var response = _vnPayService.PaymentExecute(updatedQuery);
            return Ok(response);
        }

        [HttpPost("print-bill")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> PrintBill(PrintBillCommand.PrintBillRequest command)
        {
            command.DonVi = GetDonvi();
            var result =  await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("update-nums-print")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesDefaultResponseType]
        public async Task<ActionResult> UpdateNumberPrint(UpdateSoLanInDHCommand.DonHangRequest command)
        {
            command.DonVi = GetDonvi();
            await _mediator.Send(command);
            return Ok();
        }

        [HttpPost("getallbill", Name = "GetAllBill")]
        [ProducesResponseType(typeof(UserModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllBill(GetAllBillByDonViQuery.QueryBillDv command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var danhM = await _mediator.Send(command);
            return Ok(danhM);
        }

        [HttpPost("deletebill", Name = "DeleteBill")]
        [ProducesResponseType(typeof(UserModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> DeleteBill(DeleteBillCommand.DeleteDHRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var danhM = await _mediator.Send(command);
            return Ok(danhM);
        }

        [HttpPost("update-intamtinh", Name = "UpdateBillTamTinh")]
        [ProducesResponseType(typeof(UserModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> UpdateBillTamTinh(BillDHTamTinhRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var danhM = await _mediator.Send(command);
            return Ok(danhM);
        }
    }
}
