using AutoMapper;
using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.KhuyenMai.Queries.GetListKhuyenMaiIsCheckAd;
using static Pos.API.Application.Features.NhomKhachHang.Queries.GetKhachHangIsCheckByIdNhom;

namespace Pos.API.Infrastructure.Repositories
{
    public class KhuyenMaiApDungRepository : RepositoryBase<M_KhuyenMai_ApDung>, IKhuyenMaiApDungRepository
    {
        public KhuyenMaiApDungRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<KhuyenMaiIsCheckAdModelResponse>> GetListDanhSachKmIsCheck(GetListDSToCheck request)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = request.DonVi},
                new SqlParameter { ParameterName = "@SoKhuyenMai", Value = request.SoKhuyenMai},
                new SqlParameter { ParameterName = "@SelectedValueAD", Value = request.selectedValueAD},
            };
            string sql = sql = "EXEC dbo.GetListDanhSachKmIsCheck @DonVi, @SoKhuyenMai, @SelectedValueAD";
            var data = EfSqlHelper.FromSqlQuery<KhuyenMaiIsCheckAdModelResponse>(_dbContext, sql, parms);
            return data;
        }
    }
}
