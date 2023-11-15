using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Azure.Core.HttpHeader;
using static Pos.API.Constans.CmContext;
using System.Linq;

namespace Pos.API.Infrastructure.Repositories
{
    public class BanRepository : RepositoryBase<M_Ban>, IBanRepository
    {

        public BanRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<Tablesponse>> GetTable(int? donVi, int Ma_Outlet)
        {

            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@Ma_Outlet", Value = Ma_Outlet},
            };
            string sql = "EXEC dbo.GetTablesList @DonVi, @Ma_Outlet";
            var data = EfSqlHelper.FromSqlQuery<Tablesponse>(_dbContext, sql, parms);

            return data;
        }

        public async Task<int[]> CheckTheSalesGuideSection(int? DonVi)
        {
            int totalSteps = 10; 
            int step = 0;
            List<int> resultList = new List<int>();
            
            foreach (var item in Enumerable.Range(1, totalSteps))
            {
                step = item;
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@donvi", Value = DonVi},
                    new SqlParameter { ParameterName = "@step", Value = step},
                };
                string sql = "EXEC dbo.spCheckTheSalesGuideSection @donvi, @step";
                var data = EfSqlHelper.FromSqlQuery<CheckStepIsCompletedOrNotResponse>(_dbContext, sql, parms).FirstOrDefault();
                int resultValue = data == null ? 0 : data.Result;
                resultList.Add(resultValue);
            }
            int[] rs = resultList.ToArray();
            return rs;
        }

        public async Task<int[]> CheckTheHRAdministrativeManual(int? donVi)
        {
            int totalSteps = 5;
            int step = 0;
            List<int> resultList = new List<int>();

            foreach (var item in Enumerable.Range(1, totalSteps))
            {
                step = item;
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@donvi", Value = donVi},
                    new SqlParameter { ParameterName = "@step", Value = step},
                };
                string sql = "EXEC dbo.spCheckTheHRAdministrativeManual @donvi, @step";
                var data = EfSqlHelper.FromSqlQuery<CheckStepIsCompletedOrNotResponse>(_dbContext, sql, parms).FirstOrDefault();
                int resultValue = data == null ? 0 : data.Result;
                resultList.Add(resultValue);
            }
            int[] rs = resultList.ToArray();
            return rs;
        }

        public async Task<int[]> CheckGuideToRevenueAndExpenditure(int? donVi)
        {
            int totalSteps = 5;
            int step = 0;
            List<int> resultList = new List<int>();

            foreach (var item in Enumerable.Range(1, totalSteps))
            {
                step = item;
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@donvi", Value = donVi},
                    new SqlParameter { ParameterName = "@step", Value = step},
                };
                string sql = "EXEC dbo.spGuideToRevenueAndExpenditure @donvi, @step";
                var data = EfSqlHelper.FromSqlQuery<CheckStepIsCompletedOrNotResponse>(_dbContext, sql, parms).FirstOrDefault();
                int resultValue = data == null ? 0 : data.Result;
                resultList.Add(resultValue);
            }
            int[] rs = resultList.ToArray();
            return rs;
        }
    }
}
