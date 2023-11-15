using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IPrinterRepository: IAsyncRepository<M_Printer>
    {
        Task<IEnumerable<PrinterModelResponse>> GetAllDataPrinter(int id);
    }
}
