using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class DonViRepository : RepositoryBase<M_DonVi>, IDonViRepository
    {

        public DonViRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<LanguageModelResponse>> GetNgonNguTheoNganHang(int NganhHang, int DonVi)
        {
            List<SqlParameter> param = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = DonVi},
                new SqlParameter { ParameterName = "@MaNganhHang", Value = NganhHang + ""},
            };
            string query = "EXEC dbo.GetListLanguage @DonVi, @MaNganhHang";
            var data = EfSqlHelper.FromSqlQuery<LanguageModelResponse>(_dbContext, query, param);

            return data;
        }
    }
}
