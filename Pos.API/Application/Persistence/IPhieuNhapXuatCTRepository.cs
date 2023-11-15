using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetChiTietPhieuKiemKeQuery;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetChiTietPhieuNhapXQuery;

namespace Pos.API.Application.Persistence
{
    public interface IPhieuNhapXuatCTRepository : IAsyncRepository<T_PhieuNhapXuat_ChiTiet>
    {
        Task<IEnumerable<MatHangNhapXuatModelResponse>> GetChiTietPhieuNhapX(PhieuNhapXuatCT request);
        Task<IEnumerable<MatHangNhapXuatModelResponse>> GetChiTietPhieuKiemKe(PhieuKiemKeCT request);
    }
}
