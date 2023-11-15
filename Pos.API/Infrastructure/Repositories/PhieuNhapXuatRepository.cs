using Microsoft.Data.SqlClient;
using Org.BouncyCastle.Asn1.Pkcs;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using System.Globalization;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetAllProductKiemKe;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetAllProductQuery;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetListLoaiPhieuNhapXuatQueries;

namespace Pos.API.Infrastructure.Repositories
{
    public class PhieuNhapXuatRepository : RepositoryBase<T_PhieuNhapXuat>, IPhieuNhapXuatRepository
    {
        public PhieuNhapXuatRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<PhieuNhapXuatModelResponse>> GetAllPhieuNhapXuat(LoaiPhieuNXQuery request)
        {
            DateTime tempFromDate;
            DateTime tempTodate;
            if (string.IsNullOrEmpty(request.TuNgay) && string.IsNullOrEmpty(request.DenNgay))
            {
                tempFromDate = DateTime.Now;
                tempTodate = DateTime.Now;
            }
            else
            {
                DateTime.TryParseExact(request.TuNgay, "yyyy/MM/dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out tempFromDate);
                DateTime.TryParseExact(request.DenNgay, "yyyy/MM/dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out tempTodate);
            }
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = request.DonVi},
                new SqlParameter { ParameterName = "@MaPhieu", Value = request.MaPhieu},
                new SqlParameter { ParameterName = "@TuNgay", Value = tempFromDate},
                new SqlParameter { ParameterName = "@DenNgay", Value = tempTodate},
                new SqlParameter { ParameterName = "@Type", Value = request.Type},
            };
            string sql = "EXEC dbo.GetListFillterPhieuNhapXuat @DonVi, @MaPhieu, @TuNgay, @DenNgay, @Type";
            var data = EfSqlHelper.FromSqlQuery<PhieuNhapXuatModelResponse>(_dbContext, sql, parms);
            return data;
            
        }
        public async Task<IEnumerable<MatHangNhapXuatModelResponse>> GetAllProduct(ProductQuery request)
        {
            var result = (from mh in _dbContext.M_MatHang
                          join dvmh in _dbContext.M_DonVi_MatHang on mh.Ma_DonVi equals dvmh.Ma_DonVi
                          where mh.DonVi == request.DonVi && mh.Deleted == 0
                          select new MatHangNhapXuatModelResponse
                          {
                              Id = mh.Ma_MH,
                              Ma = mh.Ma_MH,
                              Ma_MH = mh.Ma_MH,
                              Ten_MH = mh.Ten_MH,
                              DonVi = mh.DonVi,
                              Ten_DonVi = dvmh.Ten_DonVi,
                              Id_LoaiMH = mh.Loai_MH,
                              IsCheck = false,
                          }).OrderByDescending(x => x.Id).ToList();
            return result;
        }
        public async Task<IEnumerable<MatHangNhapXuatModelResponse>> GetAllProductKiemKe(int id)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = id},
            };
            string sql = "EXEC dbo.GetListMaxSoLuongProduct @DonVi";
            var data = EfSqlHelper.FromSqlQuery<MatHangNhapXuatModelResponse>(_dbContext, sql, parms);
            return data;
        }
    }
}
