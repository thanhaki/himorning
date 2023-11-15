using Microsoft.Data.SqlClient;
using Pos.API.Application.Features.ThucDonMatHang.Queries;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.DonViMatHang.Queries.GetThucDonListQuery;
using static Pos.API.Application.Features.ThucDon.Queries.GetThucDonMHById;

namespace Pos.API.Infrastructure.Repositories
{
    public class ThucDonRepository : RepositoryBase<M_ThucDon>, IThucDonRepository
    {
        public ThucDonRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<ThucDonModelResponse>> GetAllThucDon(GetThucDonQuery request)
        {

            var query =
             (from td in _dbContext.M_ThucDon
              join td_mh in _dbContext.M_ThucDon_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on td.Ma_TD equals td_mh.Ma_TD into gj
              from tdmh_subpet in gj.DefaultIfEmpty()
              join mh in _dbContext.M_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on tdmh_subpet.Ma_MH equals mh.Ma_MH into gjMH
              from mh_subpet in gjMH.DefaultIfEmpty()
              where td.Deleted == 0 && td.DonVi == request.DonVi
              select new
              {
                  Ma_TD = td.Ma_TD,
                  Ten_TD = td.Ten_TD,
                  Sort = td.Sort,
                  SoLuong = mh_subpet.Ma_MH > 0 ? 1 : 0,
              }).GroupBy(x => new { x.Ma_TD, x.Ten_TD, x.Sort }).Select(group => new ThucDonModelResponse
              {
                  Id = group.Key.Ma_TD,
                  Ten_TD = group.Key.Ten_TD,
                  Sort = group.Key.Sort,
                  SoLuong = group.Sum(c => c.SoLuong)
              }).OrderBy(x => x.Sort).ToList(); 
            return query;
        }
        public async Task<IEnumerable<MatHangModelRespose>> GetAllThucDonMatHangById(ThucDonMatHangByIdQuery request)
        {

            var query =
             (from mh in _dbContext.M_MatHang
              join tdmh in _dbContext.M_ThucDon_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on mh.Ma_MH equals tdmh.Ma_MH
              join td in _dbContext.M_ThucDon.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on tdmh.Ma_TD equals td.Ma_TD into gj
              from subpet in gj.DefaultIfEmpty()
              where mh.Deleted == 0 && tdmh.Ma_TD == request.Id && tdmh.DonVi == request.DonVi
              select new MatHangModelRespose
              {
                  Id = mh.Ma_MH,
                  Ten_MH = mh.Ten_MH,
                  HinhAnh_MH = string.IsNullOrEmpty(mh.HinhAnh_MH) ? "" : mh.HinhAnh_MH,
                  Gia_Ban = mh.Gia_Ban,
              }).GroupBy(x => new { x.Id, x.Ten_MH,x.HinhAnh_MH, x.Gia_Ban }).Select(group => new MatHangModelRespose
              {
                  Id = group.Key.Id,
                  Ten_MH = group.Key.Ten_MH,
                  HinhAnh_MH= group.Key.HinhAnh_MH,
                  Gia_Ban = group.Key.Gia_Ban,
              }).OrderByDescending(x => x.Id).ToList();
            return query;
        }
        public async Task<IEnumerable<M_ThucDon>> GetThucDonByIds(int[] Ids, int DonVi)
        {
            var data = _dbContext.M_ThucDon.Where(x => x.Deleted == 0 && x.DonVi == DonVi && Ids.Contains(x.Ma_TD));
            return data.ToList();
        }

    }
}
