using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IDanhMucMHRepository : IAsyncRepository<M_DanhMuc_MatHang>
    {
        //Task<M_DanhMuc_MatHang> CreateDanhMuc(M_DanhMuc_MatHang request);
        Task<IEnumerable<DanhMucModelResponse>> GetAllDanhMucMatHang(int id);

    }
}
