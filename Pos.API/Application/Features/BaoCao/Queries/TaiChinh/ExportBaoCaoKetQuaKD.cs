using MediatR;
using OfficeOpenXml;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Features.BaoCao.Queries.TaiChinh
{
    public class ExportBaoCaoKetQuaKD
    {
        public class ExportKQKD : IRequest<byte[]>
        {
            public int? DonVi { get; set; }
            public string? ThoiGian { set; get; }
            public string? TuNgay { set; get; }
            public string? DenNgay { set; get; }
            public string? contentRootPath { set; get; }
        }

        public class Handler : IRequestHandler<ExportKQKD, byte[]>
        {
            private readonly IDonHangRepository _donHangRepository;

            public Handler(IDonHangRepository donHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
            }

            public async Task<byte[]> Handle(ExportKQKD request, CancellationToken cancellationToken)
            {
                //var data = await _donHangRepository.GetBaoCaoKQKD(request.DonVi.Value, request.ThoiGian, request.TuNgay, request.DenNgay);

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                string folder = Utilities.GetString("PathExportBaoCao:TaiChinh");
                folder = Path.Combine(request.contentRootPath + folder);

                FileInfo fileInfo = new FileInfo(folder);

                ExcelPackage package = new ExcelPackage(fileInfo);
                ExcelWorksheet worksheet = package.Workbook.Worksheets.FirstOrDefault();
                worksheet.Cells["A1"].Value = "Hello";

                byte[] reportBytes = package.GetAsByteArray();

                return reportBytes;
            }
        }
    }
}
