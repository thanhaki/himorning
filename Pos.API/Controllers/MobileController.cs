
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.BaoCao.Queries.DoanhThu;
using Pos.API.Application.Features.DonHang.Commands;
using Pos.API.Application.Features.HinhThucTT.Queries;
using Pos.API.Application.Features.KhachHang.Queries;
using Pos.API.Application.Features.KhuyenMai.Queries;
using Pos.API.Application.Features.Outlet.Queries.GetOutletQueries;
using Pos.API.Application.Features.PostBill.Commands;
using Pos.API.Application.Features.PostBill.Queries;
using Pos.API.Application.Features.Printer.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using Pos.API.Models.BaoCao;
using Pos.API.Models.Mobile;
using System.Net;
using User.API.Application.Features.DonHang.Queries;
using User.API.Application.Features.MData.Queries;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Pos.API.Controllers
{
    [Route("api/mobile")]
    [ApiController]
    public class MobileController : BaseController
    {
        private readonly IMediator _mediator;
        public MobileController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        /// <summary>
        /// Get all outlet by id Donvi
        /// </summary>
        /// <returns></returns>
        [HttpGet("outlet", Name = "GetAllOutletByDonViMobile")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllOutletByDonViMobile()
        {
            int donVi = GetDonvi();
            var command = new GetOutletQueries.GetAllOutleQueries(donVi);
            ResponeDataListMobile<M_Outlet> data = new ResponeDataListMobile<M_Outlet>();
            data.Data = await _mediator.Send(command);
            return Ok(data);
        }

        /// <summary>
        /// Get all outlet Don Vi by id outlet
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("get-outlet-table", Name = "GetOutletByIdMobile")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetOutletByIdMobile(GetOutletById.OutletReq command)
        {
            command.DonVi = GetDonvi();
            ResponeMobile<OutletResponse> data = new ResponeMobile<OutletResponse>();
            data.Data = await _mediator.Send(command);
            return Ok(data);
        }

        /// <summary>
        /// Get menu by id Don Vi
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("get-thuc-don/{id}", Name = "GetThucDonMatHangByDonViMobile")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetThucDonMatHangByDonViMobile(int id)
        {
            id = GetDonvi();
            var query = new GetThucDonMatHangQueryByDonVi.GetThucDonRequest(id);
            ResponeDataListMobile<ThucDonModelResponse> data = new ResponeDataListMobile<ThucDonModelResponse>();
            data.Data = await _mediator.Send(query);
            return Ok(data);
        }

        /// <summary>
        /// Get infor table ordered
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost("get-table-ordered", Name = "GetTableOrderedMobile")]
        [ProducesResponseType(typeof(ResponeMobile<OrderedList>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetTableOrderedMobile(GetTableOrderedByTableNo.QueryOrderedTableNo query)
        {
            query.DonVi = GetDonvi();
            ResponeMobile<OrderedList> data = new ResponeMobile<OrderedList>();
            data.Data = await _mediator.Send(query);
            return Ok(data);
        }

        /// <summary>
        /// Get all customer by type
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet("get-customer-by-type/{type}", Name = "GetListKhByLoaiKHThanhToanMobile")]
        [ProducesResponseType(typeof(M_KhachHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<M_KhachHang>> GetListKhByLoaiKHThanhToanMobile(int type)
        {
            int dv = GetDonvi();
            var reques = new GetListKHThanhToanTTV.QueryByKHTTV(dv, type);
            ResponeDataListMobile<KhachHangModelResponse> data = new ResponeDataListMobile<KhachHangModelResponse>();
            data.Data = await _mediator.Send(reques);
            return Ok(data);
        }

        /// <summary>
        /// Get all payment method
        /// </summary>
        /// <returns></returns>
        [HttpGet("httt", Name = "GetHtttByDonViMobile")]
        public async Task<IActionResult> GetHtttByDonViMobile()
        {
            int donVi = GetDonvi();
            var query = new GetHinhThucTTByDonVi.Query(donVi);
            ResponeDataListMobile<HinhThucTTResponse> data = new ResponeDataListMobile<HinhThucTTResponse>();
            data.Data = await _mediator.Send(query);
            return Ok(data);
        }

        /// <summary>
        /// Get all Thu Ngan, Phuc Vu of Don Vi
        /// </summary>
        /// <returns></returns>
        [HttpGet("getalluser", Name = "GetAllEmployeeDonViMobile")]
        [ProducesResponseType(typeof(UserModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllEmployeeDonViMobile()
        {
            int dv = GetDonvi();
            var query = new GetAllUserByDonViQuery.QueryUserDv(dv);
            ResponeDataListMobile<UserModelResponse> data = new ResponeDataListMobile<UserModelResponse>();
            data.Data = await _mediator.Send(query);
            return Ok(data);
        }

        /// <summary>
        /// Get data by group name
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("getbygroupdata")]
        [ProducesResponseType(typeof(M_Data), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetMDataByGroupData(GetMDataByGroupNameQuery.RequestGroupData command)
        {
            ResponeDataListMobile<M_Data> data = new ResponeDataListMobile<M_Data>();
            data.Data = await _mediator.Send(command);
            return Ok(data);
        }

        /// <summary>
        /// Create and Update order
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("createorder", Name = "CreateOrderMobile")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> CreateOrderMobile(AddDonHangCommand.AddDonHangRequest request)
        {
            request.DonVi = GetDonvi();
            request.UserName = GetUsername();
            var result = await _mediator.Send(request);
            ResponeMobile<ResponseBase> responeData = new ResponeMobile<ResponseBase>();
            ResponseBase response = new ResponseBase();
            ResponeMobile<OrderedList> data = new ResponeMobile<OrderedList>();

            if (result.Status == "-2")
            {
                response.Status = StatusCodes.Status204NoContent.ToString();
                response.Message = result.Message;
                responeData.Data = response;
                return Ok(responeData);

            }

            if (result.Status == "-1")
            {
                response.Status = StatusCodes.Status204NoContent.ToString();
                response.Message = result.Message;
                responeData.Data = response;
                return Ok(responeData);
            }

            if (result.Status == "0")
            {
                response.Status = StatusCodes.Status400BadRequest.ToString();
                response.Message = result.Message;
                responeData.Data = response;
                return Ok(responeData);
            }

            if (result.Status == "1" || result.Status == "2" || result.Status == "3")
            {
                GetTableOrderedByTableNo.QueryOrderedTableNo query = new GetTableOrderedByTableNo.QueryOrderedTableNo();
                query.DonVi = request.DonVi;
                query.TableNo = request.TableNo;

                data.Data = await _mediator.Send(query);
                data.Results = new ResponseBase
                {
                    Message = result.Message,
                    Status = result.Status,
                };
            }
            return Ok(data);
        }

        /// <summary>
        /// Get all bills
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("getallbill", Name = "GetAllBillMobile")]
        [ProducesResponseType(typeof(UserModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> GetAllBillMobile(GetAllBillByDonViQuery.QueryBillDv command)
        {
            command.DonVi = GetDonvi();
            ResponeDataListMobile<BillResponse> data = new ResponeDataListMobile<BillResponse>();
            data.Data = await _mediator.Send(command);
            return Ok(data);
        }

        /// <summary>
        /// Api thanh toán
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("payment", Name = "PaymentOrderMobile")]
        [ProducesResponseType(typeof(T_DonHang), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> PaymentOrder(PaymentCommand.PaymentRequest request)
        {
            int dv = GetDonvi();
            request.DonVi = dv;
            request.UserName = GetUsername();
            var result = await _mediator.Send(request);
            ResponeMobile<ResponseBase> responeData = new ResponeMobile<ResponseBase>();
            ResponseBase obj = new ResponseBase();

            if (result == "-1")
            {
                obj.Status = StatusCodes.Status404NotFound.ToString();
                obj.Message = "Đơn hàng không tồn tại";
                responeData.Data = obj;
                return Ok(responeData);
            }

            if (result == "-2")
            {
                obj.Status = StatusCodes.Status404NotFound.ToString();
                obj.Message = "Đơn hàng đã thanh toán, vui lòng kiểm tra lại.";
                responeData.Data = obj;
                return Ok(responeData);
            }

            if (result == "0")
            {
                obj.Status = StatusCodes.Status204NoContent.ToString();
                obj.Message = "Thanh toán không thành công, Vui lòng kiểm tra lại";
                responeData.Data = obj;
                return Ok(responeData);
            }
            
            if (result.Length > 1)
            {

                obj.Status = StatusCodes.Status200OK.ToString();
                obj.Message = result;
                responeData.Data = obj;
                return Ok(responeData);
            }

            obj.Status = StatusCodes.Status200OK.ToString();
            obj.Message = "Thanh toán thành công";
            responeData.Data = obj;
            return Ok(responeData);
        }
        /// <summary>
        /// Api delete bill
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("deletebill", Name = "DeleteBillMobile")]
        [ProducesResponseType(typeof(ResponseBase), (int)HttpStatusCode.OK)]
        public async Task<ActionResult> DeleteBillMobile(DeleteBillCommand.DeleteDHRequest command)
        {
            int dv = GetDonvi();
            command.DonVi = dv;
            var result = await _mediator.Send(command);
            ResponeMobile<ResponseBase> responeData = new ResponeMobile<ResponseBase>();
            ResponseBase response = new ResponseBase();

            if (result == 1)
            {
                response.Status = StatusCodes.Status200OK.ToString();
                response.Message = "Xóa hóa đơn thành công";
                responeData.Data = response;
            }
            return Ok(responeData);
        }

        /// <summary>
        /// Report Doanh Thu
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("doanhthutongquan")]
        [ProducesResponseType(typeof(M_Outlet), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDoanhThuTongQuan(GetBaoCaoDoanhThuTongQuan.TongQuanRq request)
        {
            request.DonVi = GetDonvi();
            ResponeMobile<DoanhThuTongQuanResponse> data = new ResponeMobile<DoanhThuTongQuanResponse>();
            data.Data = await _mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-all-khuyen-mai/{id}")]
        [ProducesResponseType(typeof(KhuyenMaiModalResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<KhuyenMaiModalResponse>> GetAllKhuyenMai(int id)
        {
            id = GetDonvi();

            var reques = new GetListKhuyenMai.KhuyenMaiQuery(id);

            ResponeMobile<List<KhuyenMaiModalResponse>> data = new ResponeMobile<List<KhuyenMaiModalResponse>>();
            data.Data = await _mediator.Send(reques);

            return Ok(data);
        }

        [HttpGet("get-printer/{id}")]
        [ProducesResponseType(typeof(KhuyenMaiModalResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<KhuyenMaiModalResponse>> GetPrinterToPrint(int id)
        {
            id = GetDonvi();

            var reques = new GetPrinterToPrintQuery.GetPrint(id);

            ResponeMobile<PrinterModelResponse> data = new ResponeMobile<PrinterModelResponse>();
            data.Data = await _mediator.Send(reques);

            return Ok(data);
        }
    }
}
