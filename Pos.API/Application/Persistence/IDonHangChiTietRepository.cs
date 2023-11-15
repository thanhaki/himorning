using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IDonHangChiTietRepository : IAsyncRepository<T_DonHangChiTiet>
    {
        Task<IEnumerable<ItemMatHangDH>> GetBillDetails(string[] MaDH, int donVi, FilterBillRequest filterBillRequest);
    }
}
