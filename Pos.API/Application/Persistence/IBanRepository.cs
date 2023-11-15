using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IBanRepository : IAsyncRepository<M_Ban>
    {
        Task<IEnumerable<Tablesponse>> GetTable(int? donVi, int Ma_Outlet);
        Task<int[]> CheckTheSalesGuideSection(int? donVi);
        Task<int[]> CheckTheHRAdministrativeManual(int? donVi);
        Task<int[]> CheckGuideToRevenueAndExpenditure(int? donVi);
    }
}
