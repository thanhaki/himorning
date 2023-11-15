using AutoMapper;
using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.KhuyenMai.Queries.GetListKhuyenMaiIsCheckDT;

namespace Pos.API.Infrastructure.Repositories
{
    public class KhuyenMaiDoiTuongRepository : RepositoryBase<M_KhuyenMai_DoiTuong>, IKhuyenMaiDoiTuongRepository
    {
        public KhuyenMaiDoiTuongRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {

        }
        public async Task<IEnumerable<KhuyenMaiIsCheckAdModelResponse>> GetListDanhSachKmDtIsCheck(GetListDsDTToCheck request)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = request.DonVi},
                new SqlParameter { ParameterName = "@SoKhuyenMai", Value = request.SoKhuyenMai},
                new SqlParameter { ParameterName = "@SelectedValueDT", Value = request.SelectedValueDT},
            };
            string sql = sql = "EXEC dbo.GetListDanhSachKmDtIsCheck @DonVi, @SoKhuyenMai, @SelectedValueDT";
            var data = EfSqlHelper.FromSqlQuery<KhuyenMaiIsCheckAdModelResponse>(_dbContext, sql, parms);
            return data;

        }
    }
}
