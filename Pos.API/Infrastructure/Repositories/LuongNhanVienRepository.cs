using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.LuongNhanVien.Queries.GetListSearchSalaryQueries;
using static Pos.API.Application.Features.LuongNhanVien.Queries.GetLuongNhanVienByIdQueries;

namespace Pos.API.Infrastructure.Repositories
{
    public class LuongNhanVienRepository : RepositoryBase<T_Luong>, ILuongNhanVienRepository
    {
        public LuongNhanVienRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {

        }
        public async Task<IEnumerable<LuongNhanVienModelResponse>> GetAllLuongNhanVien(LuongNhanVien param)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = param.DonVi},
                new SqlParameter { ParameterName = "@Month", Value = param.Month},
                new SqlParameter { ParameterName = "@Year", Value = param.Year},
            };
            string sql = string.Empty;
            if (param.Status == 0)
            {
                sql = "EXEC dbo.ListFillterSalaryEmployee @DonVi, @Month, @Year";
            }
            else
            {
                sql = "EXEC dbo.DanhSachTinhLuongNV @DonVi, @Month, @Year";
            }
            var data = EfSqlHelper.FromSqlQuery<LuongNhanVienModelResponse>(_dbContext, sql, parms);
            return data;
        }

        public async Task<IEnumerable<LuongNhanVienModelResponse>> LuongNhanVienById(QueryBydId param)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = param.DonVi},
                new SqlParameter { ParameterName = "@Month", Value = param.Month},
                new SqlParameter { ParameterName = "@Year", Value = param.Year},
                new SqlParameter { ParameterName = "@So_NV", Value = param.So_NV},
            };
            string sql = string.Empty;
            if (param.Status == 0) 
            {
                sql = "EXEC dbo.LuongNhanVienById @DonVi, @Month, @Year, @So_NV";
            }
            else
            {
                sql = "EXEC dbo.ListLuongNhanVien @DonVi, @Month, @Year";
            }
            var data = EfSqlHelper.FromSqlQuery<LuongNhanVienModelResponse>(_dbContext, sql, parms);
            return data;
        }
    }
}
