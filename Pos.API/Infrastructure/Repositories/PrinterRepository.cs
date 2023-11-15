using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class PrinterRepository: RepositoryBase<M_Printer>, IPrinterRepository
    {
        public PrinterRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<PrinterModelResponse>> GetAllDataPrinter(int id)
        {
            var result = from p in _dbContext.M_Printer
                         where p.DonVi == id && p.Deleted == 0
                         select new PrinterModelResponse
                         {
                             Ma_Printer = p.Ma_Printer,
                             Ten_Printer = p.Ten_Printer,
                             IP = p.IP,
                             Port = p.Port,
                             MoKetTien = p.MoKetTien,
                             MaxNumPrint = p.MaxNumPrint,
                             NumPrints = p.NumPrints,
                             GhiChu = p.GhiChu,
                             DonVi = p.DonVi,
                             Preview= p.Preview,
                             InTamTinh = p.InTamTinh,
                             EditAddress = p.EditAddress,
                             Address = p.Address,
                             ShowFooter = p.ShowFooter,
                             InfoFooter =p.InfoFooter,
                             InQRThanhToan = p.InQRThanhToan,
                             Language = p.Language,
                             Loai_Printer = p.Loai_Printer,
                        };
            return result;
        }
    }
}
