using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetListChiTietHoSoNVQuery;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetListHoSoNhanVienQuery;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetLoaiPhongBan_TinhTrang;

namespace Pos.API.Application.Persistence
{
    public interface INhanVienHoSoRepository : IAsyncRepository<M_NhanVien_HoSo>
    {
        Task<IEnumerable<HoSoNhanVienModelResponse>> GetAllHoSoNhanVien(HoSoNhanVien request);
        Task<IEnumerable<M_Data>> GetPbTinhTrangByIdData(LoaiPbTinhTrang request);
        Task<IEnumerable<FileHoSoNhanVienModelResponse>> GetChiTietHoSoNV(HoSoNhanVienCT request);
    }
}
