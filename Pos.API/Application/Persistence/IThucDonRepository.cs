using Pos.API.Application.Features.ThucDon.Commands;
using Pos.API.Application.Features.ThucDon.Queries;
using Pos.API.Application.Features.ThucDonMatHang.Queries;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.DonViMatHang.Queries.GetThucDonListQuery;
using static Pos.API.Application.Features.ThucDon.Queries.GetThucDonMHById;

namespace Pos.API.Application.Persistence
{
    public interface IThucDonRepository : IAsyncRepository<M_ThucDon>
    {
        Task<IEnumerable<ThucDonModelResponse>> GetAllThucDon(GetThucDonQuery request);
        Task<IEnumerable<MatHangModelRespose>> GetAllThucDonMatHangById(ThucDonMatHangByIdQuery request);
        Task<IEnumerable<M_ThucDon>> GetThucDonByIds(int[] Ids, int DonVi);

    }
}
