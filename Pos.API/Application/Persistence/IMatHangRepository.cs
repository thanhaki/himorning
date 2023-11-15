using Pos.API.Domain.Entities;
using Pos.API.Models;
using Pos.API.Models.ElectronicMenu;
using static Pos.API.Application.Features.DanhMuc.Queries.GetAllProductSearch;
using static User.API.Application.Features.MatHang.Queries.GetMatHangListQuery;

namespace Pos.API.Application.Persistence
{
    public interface IMatHangRepository : IAsyncRepository<M_MatHang>
    {
        Task<IEnumerable<MatHangModelRespose>> GetAllMatHang(MatHangQuery request);
        Task<IEnumerable<MatHangModelRespose>> GetAllProductSearch(ProductSearch request);
        Task<IEnumerable<MatHangModelRespose>> GetMatHangByIdListQuery(int Ma_DonVi, int DonVi);
        Task<IEnumerable<M_MatHang>> GetMatHangByIds(int[] Ids, int DonVi);
        Task<DataElectronic> GetMatHangElectronicMenu(int DonVi);
        Task<ItemMatHangTD> GetMatHangById(int idMh, int DonVi);
        M_MatHang GetMatHangByQrCode(string qrCode, int DonVi);
    }
}
