using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Features.VaiTroNhanVien.Queries;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using System.Linq.Expressions;
using static Pos.API.Application.Features.VaiTroNhanVien.Queries.GetAllNhomQuyenByIdDataQuery;
using static Pos.API.Application.Features.VaiTroNhanVien.Queries.GetNhomQuyenListQuery;

namespace Pos.API.Infrastructure.Repositories
{
    public class NhomQuyenRepository : RepositoryBase<M_NhomQuyen>, INhomQuyenRepository
    {
        public NhomQuyenRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<NhomQuyenModelResponse>> GetAllNhomQuyen(NhomQuyenQuery request)
        {
            var list = _dbContext.M_NhomQuyen.Where(x=>x.Deleted == 0 && x.DonVi == request.DonVi)
                .Select(x => new NhomQuyenModelResponse
            {
                    id = x.Ma_NhomQuyen,
                    Ma_NhomQuyen = x.Ma_NhomQuyen,
                    TenNhomQuyen = x.TenNhomQuyen.ToString(),
                    GhiChuNhomQuyen = x.GhiChuNhomQuyen.ToString(),
                    DonVi = x.DonVi,
                    Deleted = x.Deleted,
            });
            return list;
        }
        public async Task<IEnumerable<NhomQuyenModelResponse>> GetAllNhomQuyenByIdData(NhomQuyenByIdDataQuery request)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@maNhomQuyen", Value = request.M_NhomQuyen},
                new SqlParameter { ParameterName = "@maDonVi", Value = request.DonVi},
            };
            string sql = "EXEC dbo.GetNhomQuyenByIdData @maNhomQuyen, @maDonVi";
            var data = EfSqlHelper.FromSqlQuery<NhomQuyenModelResponse>(_dbContext, sql, parms);
            return data;
        }
    }
}
