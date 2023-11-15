using Pos.API.Domain.Entities;
using Pos.API.Models; 
using static Pos.API.Application.Features.KhuyenMai.Queries.GetListKhuyenMaiIsCheckDT;

namespace Pos.API.Application.Persistence
{
    public interface IKhuyenMaiDoiTuongRepository : IAsyncRepository<M_KhuyenMai_DoiTuong>
    {
        Task<IEnumerable<KhuyenMaiIsCheckAdModelResponse>> GetListDanhSachKmDtIsCheck(GetListDsDTToCheck request);

    }
}
