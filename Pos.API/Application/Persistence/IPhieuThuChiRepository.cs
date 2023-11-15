using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IPhieuThuChiRepository: IAsyncRepository<T_PhieuThuChi>
    {
        Task<IEnumerable<PhieuThuChiModalRespose>> GetAllPhieuThuChi(int id, int typ, int[] DanhMucThuChi, ThoiGianFilter? thoiGian);
    }
}
