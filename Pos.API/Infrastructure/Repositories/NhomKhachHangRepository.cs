using AutoMapper;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.NhomKhachHang.Queries.GetKhachHangIsCheckByIdNhom;
using static Pos.API.Application.Features.ThucDon.Queries.GetMatHangToCheckThucDon;

namespace Pos.API.Infrastructure.Repositories
{
    public class NhomKhachHangRepository : RepositoryBase<M_Nhom_KhachHang>, INhomKhachHangRepository
    {
        private readonly IMapper _mapper;
        public NhomKhachHangRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<NhomKhachHangModelResponse>> GetAllNhomKhachHang(int id)
        {
            var result = (from nh in _dbContext.M_Nhom_KhachHang
                         join kh in _dbContext.M_KhachHang.Where(x => x.DonVi == id && x.Deleted == 0)  on nh.Ma_NKH equals kh.Ma_NKH into gj 
                         from subpet in gj.DefaultIfEmpty()
                         where nh.DonVi == id && nh.Deleted == 0 
                         select new 
                         {
                             Id = nh.Ma_NKH,
                             Ma_NKH = nh.Ma_NKH,
                             Ten_NKH = nh.Ten_NKH,
                             GhiChu_NKH = nh.GhiChu_NKH,
                             SoLuong = subpet.Ma_KH.HasValue ? 1 : 0,
                         }).GroupBy(x => new { x.Ma_NKH, x.Ten_NKH, x.GhiChu_NKH}).Select(group => new NhomKhachHangModelResponse
                         {
                             Id = group.Key.Ma_NKH,
                             Ma_NKH = group.Key.Ma_NKH,
                             Ten_NKH = group.Key.Ten_NKH,
                             GhiChu_NKH = group.Key.GhiChu_NKH,
                             SoLuong = group.Sum(c => c.SoLuong)
                         }).ToList();

            return result;
        }
        public async Task<IEnumerable<NhomKhachHangModelResponse>> GetKhachHangIsCheckByIdNhom(GetKhachHangToCheck request)
        {
           
            var result = (from kh in _dbContext.M_KhachHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0 && x.Ten_KH.Contains(request.Name.ToString()))
                          where (kh.Ma_NKH == 0 || kh.Ma_NKH == null) && kh.Deleted == 0 
                          select new NhomKhachHangModelResponse
                          {
                              Id = kh.Ma_KH,
                              Ma_NKH = kh.Ma_KH,
                              Ma_KH = kh.Ma_KH,
                              DienThoai_KH = kh.DienThoai_KH,
                              TongThanhToan_KH = kh.TongThanhToan_KH,
                              TongSoHoaDon_KH = kh.TongSoHoaDon_KH,
                              Ten_KH = kh.Ten_KH,
                              IsCheck =  false  
                          }).OrderByDescending(x => x.Ma_KH).ToList();
            return result;
        }
    }
}
