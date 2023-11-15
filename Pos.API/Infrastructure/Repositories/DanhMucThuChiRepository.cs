using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class DanhMucThuChiRepository: RepositoryBase<M_DanhMuc_ThuChi>, IDanhMucThuChiRepository
    {
        public DanhMucThuChiRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<DanhMucThuChiModelResponse>> GetAllDataDanhMucThuChi(int id, int typ)
        {
            var result = from dm in _dbContext.M_DanhMuc_ThuChi
                         where dm.DonVi == id && dm.Deleted == 0 && dm.Loai_DanhMucThuChi == typ
                         select new DanhMucThuChiModelResponse
                         {
                             Id = dm.MaDanhMucThuChi,
                             MaDanhMucThuChi = dm.MaDanhMucThuChi,
                             Ten_DanhMucThuChi = dm.Ten_DanhMucThuChi,
                             Loai_DanhMucThuChi = dm.Loai_DanhMucThuChi,
                             GhiChu_DanhMucThuChi = dm.GhiChu_DanhMucThuChi,
                             DonVi = dm.DonVi,
                         };
            return result;
        }
    }
}
