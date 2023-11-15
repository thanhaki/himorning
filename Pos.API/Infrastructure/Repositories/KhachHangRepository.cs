using AutoMapper;
using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class KhachHangRepository : RepositoryBase<M_KhachHang>, IKhachHangRepository
    {
        private readonly IMapper _mapper;
        public KhachHangRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<KhachHangModelResponse>> GetAllKhachHang(int donVi, int loaiKH)
        {
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@LoaiKH", Value = loaiKH},
            };
            string sql = "EXEC dbo.GetListAllKhachHangCountDonhang @DonVi, @LoaiKH";
            var data = EfSqlHelper.FromSqlQuery<KhachHangModelResponse>(_dbContext, sql, parms);
            return data;
        }
        public async Task<IEnumerable<KhachHangModelResponse>> GetListKhachHangByIdNhom(int donVi, int ma_NKH)
        {
            var result = from kh in _dbContext.M_KhachHang
                         where kh.DonVi == donVi && kh.Deleted == 0 && kh.Ma_NKH == ma_NKH
                         select new KhachHangModelResponse
                         {
                             Id = kh.Ma_KH,
                             Ma_KH = kh.Ma_KH,
                             Loai_KH = kh.Loai_KH,
                             Ma_NKH = kh.Ma_NKH,
                             Ten_KH = kh.Ten_KH,
                             DienThoai_KH = kh.DienThoai_KH,
                             DonVi = kh.DonVi,
                         };
            return result;
        }

        public async Task<IEnumerable<KhachHangModelResponse>> GetListKhByLoaiKHThanhToanTTV(int id, int loaiKh)
        {
            var result = (from kh in _dbContext.M_KhachHang
                          join ttv in _dbContext.M_TheThanhVien.Where(x => x.DonVi == id && x.Deleted == 0 && x.Ma_TTV != 0) on kh.Ma_TTV equals ttv.Ma_TTV into gj
                          from subpet in gj.DefaultIfEmpty()
                          where kh.DonVi == id &&
                          kh.Deleted == 0 &&
                          kh.Loai_KH == loaiKh 
                          select new KhachHangModelResponse
                          {
                              Ten_KH = kh.Ten_KH,
                              Ma_KH = kh.Ma_KH,
                              DienThoai_KH = kh.DienThoai_KH,
                              Ten_TTV = string.IsNullOrEmpty(subpet.Ten_TTV) ? "" : subpet.Ten_TTV,
                              DiemTichLuy = kh.DiemTichLuy,
                              TyLeQuyDoi = subpet.TyLeQuyDoi,
                              NgaySinh_KH = kh.NgaySinh_KH,
                              DiaChi_KH = kh.DiaChi_KH,
                              MaHienThi_KH = kh.MaHienThi_KH
                          });
            return result;
        }
    }
}
