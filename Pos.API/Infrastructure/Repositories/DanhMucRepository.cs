using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class DanhMucRepository : RepositoryBase<M_DanhMuc_MatHang>,IDanhMucMHRepository
    {
        public DanhMucRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<DanhMucModelResponse>> GetAllDanhMucMatHang(int id)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@donVi", Value = id},
            };
            string sql = "EXEC dbo.GetListDanhMucCountMatHang @donVi";
            var data = EfSqlHelper.FromSqlQuery<DanhMucModelResponse>(_dbContext, sql, parms);
            return data;
        }
    }
}
