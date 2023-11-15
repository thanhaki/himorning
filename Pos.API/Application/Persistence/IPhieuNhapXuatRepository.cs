using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetAllProductKiemKe;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetAllProductQuery;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetListLoaiPhieuNhapXuatQueries;

namespace Pos.API.Application.Persistence
{
    public interface IPhieuNhapXuatRepository : IAsyncRepository<T_PhieuNhapXuat>
    {
        Task<IEnumerable<PhieuNhapXuatModelResponse>> GetAllPhieuNhapXuat(LoaiPhieuNXQuery request);
        Task<IEnumerable<MatHangNhapXuatModelResponse>> GetAllProduct(ProductQuery request);
        Task<IEnumerable<MatHangNhapXuatModelResponse>> GetAllProductKiemKe(int id);
    }
}
