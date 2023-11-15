using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Features.DanhMuc.Queries;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using Pos.API.Models.ElectronicMenu;
using System.Linq;
using static Pos.API.Application.Features.DanhMuc.Queries.GetAllProductSearch;
using static User.API.Application.Features.MatHang.Queries.GetMatHangListQuery;
namespace Pos.API.Infrastructure.Repositories
{
    public class MatHangRepository : RepositoryBase<M_MatHang>, IMatHangRepository
    {
        public MatHangRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<MatHangModelRespose>> GetAllProductSearch(ProductSearch request)
        {
            var result = (from mh in _dbContext.M_MatHang
                          where
                          mh.DonVi == request.DonVi && mh.Deleted == 0 && mh.Ma_DanhMuc == request.MaDanhMuc
                          select new MatHangModelRespose
                          {
                              Id = mh.Ma_MH,
                              Ma_MH = mh.Ma_MH,
                              Ten_MH = mh.Ten_MH,
                              Ma_DonVi = mh.Ma_DonVi,
                              HinhAnh_MH = string.IsNullOrEmpty(mh.HinhAnh_MH) ? "" : mh.HinhAnh_MH,
                              Gia_Ban = mh.Gia_Ban,
                              Gia_Von = mh.Gia_Von,
                              IsNhapGiaBan = mh.IsNhapGiaBan,
                              ThoiGianApDung = mh.ThoiGianApDung,
                              LoaiThoiGianApDung = mh.LoaiThoiGianApDung,
                              QRCode = mh.QRCode,
                          }).OrderByDescending(x => x.Id).ToList();
            return result;
        }
        public async Task<IEnumerable<MatHangModelRespose>> GetAllMatHang(MatHangQuery request)
        {
            var result = (from mh in _dbContext.M_MatHang
                         join prt in _dbContext.M_Printer.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on mh.Ma_Printer equals prt.Ma_Printer into joinPrint
                         from result1 in joinPrint.DefaultIfEmpty()
                          join dm in _dbContext.M_DanhMuc_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on mh.Ma_DanhMuc equals dm.Ma_DanhMuc into joinDanhM
                          from result2 in joinDanhM.DefaultIfEmpty()
                          join dvmh in _dbContext.M_DonVi_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on mh.Ma_DonVi equals dvmh.Ma_DonVi into joinDonViMh
                          from result3 in joinDonViMh.DefaultIfEmpty()
                          where
                         (request.DanhMuc == 0 || mh.Ma_DanhMuc == request.DanhMuc) && 
                         (request.Type == 0 || mh.Loai_MH == request.Type) &&
                         mh.DonVi == request.DonVi && mh.Deleted == 0 &&
                         mh.Ten_MH.Contains(request.NameProduct)
                         select new MatHangModelRespose
                         {
                             Id = mh.Ma_MH,
                             Ma_MH = mh.Ma_MH,
                             Ten_MH = mh.Ten_MH,
                             DonVi = mh.DonVi,
                             Ten_DonVi = result3.Ten_DonVi,
                             Ma_DanhMuc = mh.Ma_DanhMuc,
                             Ma_DonVi = mh.Ma_DonVi,
                             Id_LoaiMH = mh.Loai_MH,
                             Ma_Printer = mh.Ma_Printer,
                             HinhAnh_MH = string.IsNullOrEmpty(mh.HinhAnh_MH) ? "" : mh.HinhAnh_MH,
                             Ten_DanhMuc = result2.Ten_DanhMuc,
                             Gia_Ban = mh.Gia_Ban,
                             Gia_Von = mh.Gia_Von,
                             IsNhapGiaBan = mh.IsNhapGiaBan,
                             ThoiGianApDung = mh.ThoiGianApDung,
                             LoaiThoiGianApDung = mh.LoaiThoiGianApDung,
                             TonKho = mh.TonKho,
                             Deleted = mh.Deleted,
                             Mota_MH = mh.Mota_MH,
                             MauSac_MH= mh.MauSac_MH,
                             SoLuongTonKho = mh.SoLuongTonKho,
                             TonKhoMin = mh.TonKhoMin,
                             Ten_Printer = result1.Ten_Printer,
                             QRCode = mh.QRCode,
                         }).OrderByDescending(x => x.Id).ToList(); 
            return result;
        }

        public async Task<IEnumerable<MatHangModelRespose>> GetMatHangByIdListQuery(int Ma_DonVi, int DonVi)
        {
            var result = from mh in _dbContext.M_MatHang
                         join dvmh in _dbContext.M_DonVi_MatHang.Where(x => x.DonVi == DonVi && x.Deleted == 0 && x.Ma_DonVi == Ma_DonVi) on mh.Ma_DonVi equals dvmh.Ma_DonVi
                         where mh.Deleted == 0 && mh.DonVi == DonVi 
                         select new MatHangModelRespose
                         {
                             Id = mh.Ma_MH,
                             Ten_MH = mh.Ten_MH,
                             DonVi = mh.DonVi,
                             Ma_DonVi = mh.Ma_DonVi,
                             Deleted = mh.Deleted
                         };
            return result;
        }

        public async Task<IEnumerable<M_MatHang>> GetMatHangByIds(int[] Ids, int DonVi)
        {
            var data = _dbContext.M_MatHang.Where(x => x.Deleted == 0 && x.DonVi == DonVi && Ids.Contains(x.Ma_MH));
            return data;
        }

        public async Task<DataElectronic> GetMatHangElectronicMenu(int DonVi)
        {
            var dv = _dbContext.M_DonVi.FirstOrDefault(x=>x.DonVi== DonVi && x.Deleted == 0);
            DataElectronic dataElectronic = new DataElectronic();

            if (dv != null)
            {
                var data = _dbContext.M_ThucDon.Where(x => x.DonVi == DonVi && x.Deleted == 0).OrderBy(x => x.Sort).Select(item => new ListThucDons
                {
                    Ma_TD = item.Ma_TD,
                    Ten_TD = item.Ten_TD,
                    ListMH = (from tdmh in _dbContext.M_ThucDon_MatHang
                              join mh in _dbContext.M_MatHang on tdmh.Ma_MH equals mh.Ma_MH
                              where mh.Deleted == 0 && mh.DonVi == DonVi && tdmh.Deleted == 0 && tdmh.DonVi == DonVi && tdmh.Ma_TD == item.Ma_TD
                              select new ItemMatHangTD
                              {
                                  Ten_MH = mh.Ten_MH,
                                  Gia_Ban = mh.Gia_Ban,
                                  HinhAnh_MH01 = !string.IsNullOrEmpty(mh.HinhAnh_MH01) ? mh.HinhAnh_MH01 : mh.HinhAnh_MH,
                                  Ma_MH = mh.Ma_MH,
                                  SoLuongDaBan = _dbContext.T_DonHangChiTiet.Where(x => x.DonVi == DonVi && x.Ma_MH == mh.Ma_MH && x.Deleted == 0).Sum(x => x.SoLuong_MH)
                              }).ToList()
                });
                dataElectronic.ListThucDons = data;
                dataElectronic.InforDonVi = new InfoDonVi
                {
                    AnhBiaPCDonVi = dv.AnhBiaPCDonVi,
                    AnhBiaSPDonVi = dv.AnhBiaSPDonVi,
                    AnhBiaIPDonVi = dv.AnhBiaIPDonVi,
                    DiaChiDonVi = dv.DiaChiDonVi,
                    Email = dv.Email,
                    LogoDonVi = dv.LogoDonVi,
                    Phone = dv.DienThoaiDonVi,
                    DonVi = dv.DonVi,
                    TenCongTy  = dv.TenDonVi
                };
            }
            return dataElectronic; 
        }

        public async Task<ItemMatHangTD> GetMatHangById(int idMh, int DonVi)
        {
            var dv = _dbContext.M_DonVi.FirstOrDefault(x => x.DonVi == DonVi && x.Deleted == 0);
            var ItemMatHangTD = new ItemMatHangTD();
            if (dv != null)
            {
                var soLuongDaBan = _dbContext.T_DonHangChiTiet.Where(x => x.DonVi == DonVi && x.Ma_MH == idMh && x.Deleted == 0).Sum(x => x.SoLuong_MH);

                var data = from mh in _dbContext.M_MatHang
                           where mh.DonVi == DonVi && mh.Deleted == 0 && mh.Ma_MH == idMh
                           select new ItemMatHangTD
                           {
                               Ma_MH = mh.Ma_MH,
                               Gia_Ban = mh.Gia_Ban,
                               HinhAnh_MH01 = !string.IsNullOrEmpty(mh.HinhAnh_MH01) ? mh.HinhAnh_MH01 : mh.HinhAnh_MH,
                               Ten_MH = mh.Ten_MH,
                               MieuTa_MH = string.IsNullOrEmpty(mh.MieuTa_MH) ? "" : mh.MieuTa_MH,
                               SoLuongDaBan = soLuongDaBan,
                               ListImages = new List<string> {
                                mh.HinhAnh_MH01,
                                mh.HinhAnh_ChiaSe,
                                mh.HinhAnh_MH02,
                                mh.HinhAnh_MH03,
                                mh.HinhAnh_MH04,
                                mh.HinhAnh_MH05,
                                mh.HinhAnh_MH06,
                                mh.HinhAnh_MH07,
                                mh.HinhAnh_MH08,
                                mh.HinhAnh_MH09,
                                mh.HinhAnh_MH10,
                           },
                               Video_MH = mh.Video_MH
                           };
                ItemMatHangTD = data.FirstOrDefault();

                ItemMatHangTD.InforDonVi = new InfoDonVi
                {
                    AnhBiaPCDonVi = dv.AnhBiaPCDonVi,
                    AnhBiaSPDonVi = dv.AnhBiaSPDonVi,
                    AnhBiaIPDonVi = dv.AnhBiaIPDonVi,
                    DiaChiDonVi = dv.DiaChiDonVi,
                    Email = dv.Email,
                    LogoDonVi = dv.LogoDonVi,
                    Phone = dv.DienThoaiDonVi,
                    DonVi = dv.DonVi,
                    TenCongTy = dv.TenDonVi
                };
            }
            return ItemMatHangTD;
        }

        public M_MatHang GetMatHangByQrCode(string qrCode, int DonVi)
        {
            return _dbContext.M_MatHang.AsNoTracking().FirstOrDefault(x => x.DonVi == DonVi && x.Deleted == 0 && x.QRCode == qrCode);
        }
    }
}
