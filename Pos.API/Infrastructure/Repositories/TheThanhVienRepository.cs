using AutoMapper;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using System.Text.RegularExpressions;
using static Pos.API.Application.Features.TheThanhVien.Queries.GetAllKhachHangIsCheckByIdThe;
using static Pos.API.Application.Features.TheThanhVien.Queries.GetKhachHangByIdThe;

namespace Pos.API.Infrastructure.Repositories
{
    public class TheThanhVienRepository : RepositoryBase<M_TheThanhVien>, ITheThanhVienRepository
    {
        private readonly IMapper _mapper;
        public TheThanhVienRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {

        }
        public async Task<IEnumerable<TheThanhVienModelResponse>> GetAllTheThanhVien(int id)
        {
            var result = (from tv in _dbContext.M_TheThanhVien
                          join kh in _dbContext.M_KhachHang.Where(x=>x.DonVi == id && x.Deleted == 0) on tv.Ma_TTV equals kh.Ma_TTV into gj
                          from sub in gj.DefaultIfEmpty()
                          where tv.DonVi == id && tv.Deleted == 0
                          select new 
                          {
                              Id = tv.Ma_TTV,
                              Ma_TTV = tv.Ma_TTV,
                              Ten_TTV = tv.Ten_TTV,
                              DiemToiThieu = tv.DiemToiThieu,
                              DiemToiDa = tv.DiemToiDa,
                              TyLeQuyDoi = tv.TyLeQuyDoi,
                              MieuTa = tv.MieuTa,
                              GhiChu_TTV = tv.GhiChu_TTV,
                              DonVi = tv.DonVi,
                              SoLuongTV = sub.Ma_KH.HasValue ? 1 : 0,
                          }).GroupBy(x=> new {x.Id, x.Ma_TTV, x.Ten_TTV, x.DiemToiThieu, x.DiemToiDa, x.TyLeQuyDoi, x.MieuTa, x.GhiChu_TTV, x.DonVi}).Select(group => new TheThanhVienModelResponse
                          {
                              Id = group.Key.Ma_TTV,
                              Ma_TTV = group.Key.Ma_TTV,
                              Ten_TTV = group.Key.Ten_TTV,
                              DiemToiThieu = group.Key.DiemToiThieu,
                              DiemToiDa = group.Key.DiemToiDa,
                              TyLeQuyDoi = group.Key.TyLeQuyDoi,
                              MieuTa = group.Key.MieuTa,
                              GhiChu_TTV = group.Key.GhiChu_TTV,
                              DonVi = group.Key.DonVi,
                              SoLuongTV = group.Sum(c => c.SoLuongTV)
                          });

            return result;
        }
        public async Task<IEnumerable<TheThanhVienModelResponse>> GetAllKhachHangByIdThe(GetKhachHangByIdQuery request)
        {
            var result = (from tv in _dbContext.M_TheThanhVien
                          join kh in _dbContext.M_KhachHang on tv.Ma_TTV equals kh.Ma_TTV
                          where tv.DonVi == request.DonVi && tv.Deleted == 0 && tv.Ma_TTV == request.Ma_TTV
                          select new TheThanhVienModelResponse
                          {
                              Id = kh.Ma_KH,
                              Ma_KH = kh.Ma_KH,
                              Ten_KH = kh.Ten_KH,
                              DiemTichLuy = kh.DiemTichLuy,
                              DienThoai_KH = kh.DienThoai_KH,
                              DonVi = tv.DonVi,
                          }).ToList();

            return result;
        }
        public async Task<IEnumerable<TheThanhVienModelResponse>> GetKhachHangIsCheckByIdThe(KhachHangToCheck request)
        {
            var a = _dbContext.M_KhachHang.ToList();
            var result = (from kh in _dbContext.M_KhachHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0 && x.Ten_KH.Contains(request.Name + ""))
                          where kh.Ma_TTV == 0 || kh.Ma_TTV == null
                          select new TheThanhVienModelResponse
                          {
                              Id = kh.Ma_KH,
                              Ma_TTV = kh.Ma_TTV,
                              Ma_KH = kh.Ma_KH,
                              Ten_KH = kh.Ten_KH,
                              TongThanhToan_KH = kh.TongThanhToan_KH,
                              DienThoai_KH = kh.DienThoai_KH,
                              TongSoHoaDon_KH = kh.TongSoHoaDon_KH,
                              IsCheck = false
                          }).OrderByDescending(x => x.Ma_KH).ToList();
            return result;
        }
    }
}
