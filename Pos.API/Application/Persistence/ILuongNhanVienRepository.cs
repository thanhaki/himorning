using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.LuongNhanVien.Queries.GetListSearchSalaryQueries;
using static Pos.API.Application.Features.LuongNhanVien.Queries.GetLuongNhanVienByIdQueries;

namespace Pos.API.Application.Persistence
{
    public interface ILuongNhanVienRepository : IAsyncRepository<T_Luong>
    {
        Task<IEnumerable<LuongNhanVienModelResponse>> GetAllLuongNhanVien(LuongNhanVien request);
        Task<IEnumerable<LuongNhanVienModelResponse>> LuongNhanVienById(QueryBydId request);
    }
}
