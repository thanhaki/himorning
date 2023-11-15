using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.LichSuCongTacNhanVien.Queries.GetLichLamViecNhanVienQueries;

namespace Pos.API.Infrastructure.Repositories
{
    public class LichLamViecNhanVienRepository : RepositoryBase<T_LichCongTac_NhanVien>, ILichLamViecNVRepository
    {
        public LichLamViecNhanVienRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {

        }
        public async Task<IEnumerable<LichLamViecNhanVienModelResponse>> GetAllLichLamViecNhanVien(LichLamViec request)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = request.DonVi},
                new SqlParameter { ParameterName = "@Month", Value = request.Month},
                new SqlParameter { ParameterName = "@Year", Value = request.Year},
            };
            string sql = "EXEC dbo.GetListFillterLichLamViec @DonVi, @Month, @Year";
            var data = EfSqlHelper.FromSqlQuery<LichLamViecNhanVienModelResponse>(_dbContext, sql, parms);
            return data;
        }

        public async Task<T_LichCongTac_NhanVien> GetTableLichCongTac(int soNV, int? month, int? year, int? donVi)
        {
            var query = new T_LichCongTac_NhanVien();
            var list = await _dbContext.T_LichCongTac_NhanVien.FirstOrDefaultAsync(x=>x.So_NV == soNV && x.Month == month 
                        && x.Year == year && x.Deleted == 0 && x.DonVi == donVi);
            return list;
        }

    }
}
