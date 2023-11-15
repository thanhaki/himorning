using Pos.API.Application.Features.VaiTroNhanVien.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.VaiTroNhanVien.Queries.GetAllNhomQuyenByIdDataQuery;
using static Pos.API.Application.Features.VaiTroNhanVien.Queries.GetNhomQuyenListQuery;

namespace Pos.API.Application.Persistence
{
    public interface INhomQuyenRepository : IAsyncRepository<M_NhomQuyen>
    {
        Task<IEnumerable<NhomQuyenModelResponse>> GetAllNhomQuyen(NhomQuyenQuery request);
        Task<IEnumerable<NhomQuyenModelResponse>> GetAllNhomQuyenByIdData(NhomQuyenByIdDataQuery request);
    }
}
