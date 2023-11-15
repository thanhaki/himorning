using Pos.API.Application.Features.ThucDon.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.NhomKhachHang.Queries.GetKhachHangIsCheckByIdNhom;

namespace Pos.API.Application.Persistence
{
    public interface INhomKhachHangRepository : IAsyncRepository<M_Nhom_KhachHang>
    {
        Task<IEnumerable<NhomKhachHangModelResponse>> GetAllNhomKhachHang(int id);
        Task<IEnumerable<NhomKhachHangModelResponse>> GetKhachHangIsCheckByIdNhom(GetKhachHangToCheck request);
    }
}
