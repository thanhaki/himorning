using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetListChiTietHoSoNVQuery;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetListHoSoNhanVienQuery;
using static Pos.API.Application.Features.NhanVienHeSo.Queries.GetLoaiPhongBan_TinhTrang;

namespace Pos.API.Infrastructure.Repositories
{
    public class NhanVienHoSoRepository : RepositoryBase<M_NhanVien_HoSo>, INhanVienHoSoRepository
    {
        public NhanVienHoSoRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<HoSoNhanVienModelResponse>> GetAllHoSoNhanVien(HoSoNhanVien request)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = request.DonVi},
                new SqlParameter { ParameterName = "@PhongBan", Value = request.PhongBan},
                new SqlParameter { ParameterName = "@TinhTrang", Value = request.TinhTrang},
            };
            string sql = "EXEC dbo.GetListFillterHoSoNV @DonVi, @PhongBan, @TinhTrang";
            var data = EfSqlHelper.FromSqlQuery<HoSoNhanVienModelResponse>(_dbContext, sql, parms);
            return data;
        }
        public async Task<IEnumerable<M_Data>> GetPbTinhTrangByIdData(LoaiPbTinhTrang request)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = request.DonVi},
            };
            string sql = "EXEC dbo.GetLoaiPbTinhTrang @DonVi";
            var data = EfSqlHelper.FromSqlQuery<M_Data>(_dbContext, sql, parms);
            return data;
        }
        public async Task<IEnumerable<FileHoSoNhanVienModelResponse>> GetChiTietHoSoNV(HoSoNhanVienCT request)
        {
            var result = (from hsnv in _dbContext.M_NhanVien_HoSo
                         where hsnv.DonVi == request.DonVi && hsnv.So_NV == request.So_NV
                         select new FileHoSoNhanVienModelResponse
                         {
                             Id = hsnv.File_No,
                             File_No = hsnv.File_No,
                             File_Name = hsnv.File_Name,
                             File_Start = hsnv.File_Start,
                             File_End = hsnv.File_End,
                             File_Warning = hsnv.File_Warning,
                             File_URL = hsnv.File_URL,
                         }).OrderByDescending(x => x.Id).ToList();
            return result;
        }
    }
}
