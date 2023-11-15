using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IDonViMathangRepository : IAsyncRepository<M_DonVi_MatHang>
    {
        Task<IEnumerable<DonViMatHangModelRespose>> GetAllDonViMatHang(int id);

    }
}
