using MediatR;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using Pos.API.Application.Features.BaoCao.Queries.TaiChinh;
using Pos.API.Common;
using Pos.API.Models;
using System.Net;
using User.API.Application.Features.Users.Queries;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Pos.API.Controllers
{
    [Route("api/export")]
    [ApiController]
    public class ExportFileController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ExportFileController(IMediator mediator, IWebHostEnvironment webHostEnvironment)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("bao-cao-tai-chinh")]
        [ProducesResponseType(typeof(DonViModelResponse), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<DonViModelResponse>> ExportBaoCaoTaiChinh(ExportBaoCaoKetQuaKD.ExportKQKD command)
        {
            string contentRootPath = _webHostEnvironment.ContentRootPath;
            command.contentRootPath = contentRootPath;

            byte[] reportBytes = await _mediator.Send(command);

            return File(reportBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "test");
        }

        //private List<ImportedRecord> ImportRecords()
        //{
        //    var ret = new List<ImportedRecord>();
        //    var fInfo = new FileInfo(@"C:\temp\book1.xlsx");
        //    using (var excel = new ExcelPackage(fInfo))
        //    {
        //        var wks = excel.Workbook.Worksheets["Sheet1"];
        //        var lastRow = wks.Dimension.End.Row;

        //        for (int i = 2; i <= lastRow; i++)
        //        {
        //            var importedRecord = new ImportedRecord
        //            {
        //                ChildName = wks.Cells[i, 4].Value.ToString(),
        //                SubGroupName = GetCellValueFromPossiblyMergedCell(wks, i, 3),
        //                GroupName = GetCellValueFromPossiblyMergedCell(wks, i, 2)
        //            };
        //            ret.Add(importedRecord);
        //        }
        //    }

        //    return ret;
        //}
    }
}
