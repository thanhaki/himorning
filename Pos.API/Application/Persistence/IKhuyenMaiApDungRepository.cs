using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.KhuyenMai.Queries.GetListKhuyenMaiIsCheckAd;

namespace Pos.API.Application.Persistence
{
    public interface IKhuyenMaiApDungRepository : IAsyncRepository<M_KhuyenMai_ApDung>
    {
        Task<IEnumerable<KhuyenMaiIsCheckAdModelResponse>> GetListDanhSachKmIsCheck(GetListDSToCheck request);

    }
}
