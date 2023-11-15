using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class DonViMatHangRepository : RepositoryBase<M_DonVi_MatHang>, IDonViMathangRepository
    {
        public DonViMatHangRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<DonViMatHangModelRespose>> GetAllDonViMatHang(int id)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = id},
            };
            string sql = "EXEC dbo.GetListDonViCountMatHang @DonVi";
            var data = EfSqlHelper.FromSqlQuery<DonViMatHangModelRespose>(_dbContext, sql, parms);
            return data;
        }
    }
}
