using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.TheThanhVien.Queries.GetAllKhachHangIsCheckByIdThe;
using static Pos.API.Application.Features.TheThanhVien.Queries.GetKhachHangByIdThe;

namespace Pos.API.Application.Persistence
{
    public interface ITheThanhVienRepository : IAsyncRepository<M_TheThanhVien>
    {
        Task<IEnumerable<TheThanhVienModelResponse>> GetAllTheThanhVien(int id);
        Task<IEnumerable<TheThanhVienModelResponse>> GetKhachHangIsCheckByIdThe(KhachHangToCheck request);
        Task<IEnumerable<TheThanhVienModelResponse>> GetAllKhachHangByIdThe(GetKhachHangByIdQuery request);
    }
}
