using AutoMapper;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class LichSuTichDiemKHRepository : RepositoryBase<T_LichSuTichDiem_KhachHang>, ILichSuTichDiemKHRepository
    {
        private readonly IMapper _mapper;
        public LichSuTichDiemKHRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<LichSuTichDiemKhModelResponse>> GetLichSuTichDiemKH(int id, int ma_KH)
        {
            var result = (from ls in _dbContext.T_LichSuTichDiem_KhachHang
                          join dh in _dbContext.T_DonHang on ls.SoDonHang equals dh.SoDonHang
                          where ls.DonVi == id && ls.Deleted == 0 && ls.Ma_KH == ma_KH
                         select new LichSuTichDiemKhModelResponse
                         {
                             Id = ls.MaLichSuTichDiem,
                             MaLichSuTichDiem = ls.MaLichSuTichDiem,
                             Ma_KH = ls.Ma_KH,
                             SoDonHang = ls.SoDonHang,
                             MaDonHang = dh.MaDonHang,
                             CreateDate = ls.CreateDate,
                             Tien_DonHang = dh.ThanhTien_DonHang,
                             DiemTichLuyCu = ls.DiemTichLuyCu,
                             DiemTichLuyThem = ls.DiemTichLuyThem,
                             DiemTichLuyMoi = ls.DiemTichLuyMoi,
                             NoiDungTichLuy = ls.NoiDungTichLuy,
                         }).OrderByDescending(x=>x.CreateDate).ToList();
            return result;
        }
    }
}
