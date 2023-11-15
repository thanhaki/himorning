using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IDanhMucThuChiRepository: IAsyncRepository<M_DanhMuc_ThuChi>
    {
        Task<IEnumerable<DanhMucThuChiModelResponse>> GetAllDataDanhMucThuChi(int id, int typ);
    }
}
