using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetListHeSoNhanVienQuery;

namespace Pos.API.Application.Persistence
{
    public interface INhanVienHeSoRepository : IAsyncRepository<M_NhanVien_HeSo>
    {
        Task<IEnumerable<NhanVienHeSoModelResponse>> GetAllHeSoNhanVien(HeSoNhanVien request);

    }
}
