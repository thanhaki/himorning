using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.LichSuCongTacNhanVien.Queries.GetLichLamViecNhanVienQueries;

namespace Pos.API.Application.Persistence
{
    public interface ILichLamViecNVRepository : IAsyncRepository<T_LichCongTac_NhanVien>
    {
        Task<IEnumerable<LichLamViecNhanVienModelResponse>> GetAllLichLamViecNhanVien(LichLamViec request);
        Task<T_LichCongTac_NhanVien> GetTableLichCongTac(int soNV, int? month, int? year, int? donVi);

    }
}
