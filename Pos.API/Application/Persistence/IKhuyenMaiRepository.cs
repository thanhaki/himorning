using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IKhuyenMaiRepository : IAsyncRepository<M_KhuyenMai>
    {
        Task<IEnumerable<KhuyenMaiModalResponse>> GetAllKhuyenMai(int id);
    }
}
