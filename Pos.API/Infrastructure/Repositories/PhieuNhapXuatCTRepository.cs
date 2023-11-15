using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetChiTietPhieuKiemKeQuery;
using static Pos.API.Application.Features.PhieuNhapXuat.Queries.GetChiTietPhieuNhapXQuery;

namespace Pos.API.Infrastructure.Repositories
{
    public class PhieuNhapXuatCTRepository : RepositoryBase<T_PhieuNhapXuat_ChiTiet>, IPhieuNhapXuatCTRepository
    {
        public PhieuNhapXuatCTRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<MatHangNhapXuatModelResponse>> GetChiTietPhieuNhapX(PhieuNhapXuatCT request)
        {
            var result = (from pnx in _dbContext.T_PhieuNhapXuat_ChiTiet
                          join mh in _dbContext.M_MatHang on pnx.Ma_MH equals mh.Ma_MH
                          join dvmh in _dbContext.M_DonVi_MatHang on mh.Ma_DonVi equals dvmh.Ma_DonVi
                          where pnx.DonVi == request.DonVi && pnx.Deleted == 0 && pnx.Ma_PNX == request.Ma_PNX
                          select new MatHangNhapXuatModelResponse
                          {
                              Id = pnx.Ma_MH,
                              Ma_PNX = pnx.Ma_PNX,
                              Ma_MH = pnx.Ma_MH,
                              Ten_MH = pnx.Ten_MH,
                              Ten_DonVi = dvmh.Ten_DonVi,
                              SoLuong = pnx.SoLuong,
                              DonVi = pnx.DonVi
                          }).OrderByDescending(x => x.Id).ToList();
            return result;
        }

        public async Task<IEnumerable<MatHangNhapXuatModelResponse>> GetChiTietPhieuKiemKe(PhieuKiemKeCT request)
        {
            var result = (from pnx in _dbContext.T_PhieuNhapXuat_ChiTiet
                          join mh in _dbContext.M_MatHang on pnx.Ma_MH equals mh.Ma_MH
                          join dvmh in _dbContext.M_DonVi_MatHang on mh.Ma_DonVi equals dvmh.Ma_DonVi
                          where pnx.DonVi == request.DonVi && pnx.Deleted == 0 && pnx.Ma_PNX == request.Ma_PNX
                          select new MatHangNhapXuatModelResponse
                          {
                              Id = pnx.Ma_MH,
                              Ma_PNX = pnx.Ma_PNX,
                              Ma_MH = pnx.Ma_MH,
                              Ten_MH = pnx.Ten_MH,
                              Ten_DonVi = dvmh.Ten_DonVi,
                              SoLuong = pnx.SoLuong,
                              SoLuongBanDau = pnx.SoLuongBanDau,
                              SoLuongChenhLech = pnx.SoLuongChenhLech,
                              SoLuongKiemKe = pnx.SoLuongKiemKe,
                              LyDoDieuChinh = pnx.LyDoDieuChinh,
                              DonVi = pnx.DonVi
                          }).OrderByDescending(x => x.Id).ToList();
            return result;
        }
    }
}
