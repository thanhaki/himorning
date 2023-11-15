using Microsoft.EntityFrameworkCore;
using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface INhanVienRepository : IAsyncRepository<M_User>
    {
        Task<IEnumerable<NhanVienModelRespose>> GetAllNhanVien(int id);
    }
}
