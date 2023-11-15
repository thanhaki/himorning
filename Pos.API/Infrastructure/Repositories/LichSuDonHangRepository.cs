using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using System.Collections;

namespace Pos.API.Infrastructure.Repositories
{
    public class LichSuDonHangRepository : RepositoryBase<T_LichSu_MatHang>, ILichSuDonHangRepository
    {

        public LichSuDonHangRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<int> GetSoLuongConLaiMH(int DonVi, int MaMH)
        {
            var result = (from mh in _dbContext.M_MatHang
                         join ls in _dbContext.T_LichSu_MatHang.Where(x=>x.DonVi == DonVi && x.Deleted == 0) on mh.Ma_MH equals ls.Ma_MH into gj
                         from subpet in gj.DefaultIfEmpty()
                         let soluong = (subpet.SoLuongConLai == 0 || subpet.SoLuongConLai == null) ? mh.SoLuongTonKho : subpet.SoLuongConLai
                         where mh.DonVi == DonVi && mh.Deleted == 0 && mh.Ma_MH == MaMH 
                         orderby subpet.MaLichSu descending
                         select soluong).Take(1).FirstOrDefault();
            return (int)result;  
        }
        public async Task<IEnumerable<LichSuKhoModelResponse>> GetAllLichSuMh(int DonVi, string TenMH, string TuNgay, string DenNgay)
        {
            var result = (from ls in _dbContext.T_LichSu_MatHang 
                          join user in _dbContext.M_User on ls.CreateBy equals user.UserName
                          where ls.DonVi == DonVi && user.DonVi == DonVi && ls.Deleted == 0 && ls.Ten_MH.Contains(TenMH + "")
                          && (ls.NgayLichSu.Date >= Convert.ToDateTime(TuNgay) || ls.NgayLichSu.Date <= Convert.ToDateTime(DenNgay))
                          select new LichSuKhoModelResponse
                          {
                              Id = ls.MaLichSu,
                              MaLichSu = ls.MaLichSu,
                              Ten_MH = ls.Ten_MH,
                              NoiDung_LichSu = ls.NoiDung_LichSu,
                              Ma_ThamChieu = ls.Ma_ThamChieu,
                              SoLuongThayDoi = ls.SoLuongThayDoi,
                              SoLuongConLai = ls.SoLuongConLai,
                              NgayLichSu = ls.NgayLichSu,
                              NguoiTao = user.FullName,
                          }).OrderByDescending(x => x.Id).ToList();
            return result;
        }
        public async Task<IEnumerable<TonKhoModelResponse>> GetListTonKho(int DonVi)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = DonVi},
            };
            string sql = "EXEC dbo.GetListDanhSachTonKho @DonVi";
            var data = EfSqlHelper.FromSqlQuery<TonKhoModelResponse>(_dbContext, sql, parms);
            return data;
        }
        public async Task<IEnumerable<TonKhoModelResponse>> GetDsFilterMh(int DonVi, string TenMh)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = DonVi},
                new SqlParameter { ParameterName = "@TenMatHang", Value = TenMh},
            };
            string sql = "EXEC dbo.GetListhFilterMhTonKho @DonVi, @TenMatHang";
            var data = EfSqlHelper.FromSqlQuery<TonKhoModelResponse>(_dbContext, sql, parms);
            return data;
        }
    }
}
