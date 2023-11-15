using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetListHeSoNhanVienQuery;

namespace Pos.API.Infrastructure.Repositories
{
    public class NhanVienHeSoRepository : RepositoryBase<M_NhanVien_HeSo>, INhanVienHeSoRepository
    {
        public NhanVienHeSoRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<NhanVienHeSoModelResponse>> GetAllHeSoNhanVien(HeSoNhanVien request)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = request.DonVi},
            };
            string sql = "EXEC dbo.GetListHeSoNhanVien @DonVi";
            var data = EfSqlHelper.FromSqlQuery<NhanVienHeSoModelResponse>(_dbContext, sql, parms);
            return data;
        }
    }
}
