using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.ThucDon.Queries.GetMatHangToCheckThucDon;
using static Pos.API.Application.Features.ThucDonMatHang.Queries.GetThucDonMatHangQuery;

namespace Pos.API.Application.Persistence
{
    public interface IThucDonMatHangRepository : IAsyncRepository<M_ThucDon_MatHang>
    {
        Task<IEnumerable<ThucDonMatHangModelResponse>> GetAllThucDonMatHang(GetThucDonMHQuery request);
        Task<IEnumerable<ThucDonModelResponse>> GetTDMatHangByDonVi(int donVi);
        Task<IEnumerable<ThucDonMatHangIsCheckModelResponse>> GetMatHangToCheckThucDon(GetMatHangToCheck request);
        Task<IEnumerable<ThucDonModelResponse>> GetThucDonMHById(int donVi,int maMh);
    }
}
