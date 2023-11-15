using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface ILichSuTichDiemKHRepository : IAsyncRepository<T_LichSuTichDiem_KhachHang>
    {
        Task<IEnumerable<LichSuTichDiemKhModelResponse>> GetLichSuTichDiemKH(int donVi, int ma_KH);
    }
}
