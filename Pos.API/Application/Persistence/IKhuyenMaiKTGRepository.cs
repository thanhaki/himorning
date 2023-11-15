using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.KhuyenMai.Queries.GetListTimeByIdKhuyenMai;

namespace Pos.API.Application.Persistence
{
    public interface IKhuyenMaiKTGRepository : IAsyncRepository <M_KhuyenMai_KhoangThoiGian>
    {
        Task<IEnumerable<KhuyenMaiModalResponse>> GetListTimeKhuyenMaiBydId(TimeKhuyenMaiQuery request);
    }
}
