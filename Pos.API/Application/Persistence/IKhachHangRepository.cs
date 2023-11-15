using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IKhachHangRepository : IAsyncRepository<M_KhachHang>
    {
        Task<IEnumerable<KhachHangModelResponse>> GetAllKhachHang(int donVi, int loaiKh);
        Task<IEnumerable<KhachHangModelResponse>> GetListKhachHangByIdNhom(int donVi, int Ma_NKH);
        Task<IEnumerable<KhachHangModelResponse>> GetListKhByLoaiKHThanhToanTTV(int donVi, int loaiKh);

    }
}
