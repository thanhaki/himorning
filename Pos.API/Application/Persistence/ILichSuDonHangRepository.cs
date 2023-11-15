using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Collections;

namespace Pos.API.Application.Persistence
{
    public interface ILichSuDonHangRepository : IAsyncRepository<T_LichSu_MatHang>
    {
        Task<int> GetSoLuongConLaiMH(int DonVi, int MaMH);
        Task<IEnumerable<LichSuKhoModelResponse>> GetAllLichSuMh(int DonVi, string TenMH, string TuNgay, string DenNgay);
        Task<IEnumerable<TonKhoModelResponse>> GetListTonKho(int DonVi);
        Task<IEnumerable<TonKhoModelResponse>> GetDsFilterMh(int DonVi, string TenMh);

    }
}
