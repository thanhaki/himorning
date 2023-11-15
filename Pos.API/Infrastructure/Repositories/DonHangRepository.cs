using Microsoft.Data.SqlClient;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using Pos.API.Models.BaoCao;
using System;
using System.Globalization;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Infrastructure.Repositories
{
    public class DonHangRepository : RepositoryBase<T_DonHang>, IDonHangRepository
    {
        public DonHangRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<BillResponse>> GetBills(int donVi, FilterBillRequest filter)
        {
            var thoigian = filter.thoigian;
            DateTime tempFromDate;
            DateTime tempTodate;
            if (string.IsNullOrEmpty(thoigian.TuNgay) && string.IsNullOrEmpty(thoigian.DenNgay))
            {
                tempFromDate= DateTime.Now;
                tempTodate = DateTime.Now;
            } 
            else
            {
                try
                {
                    tempFromDate = Convert.ToDateTime(thoigian.TuNgay);
                    tempTodate = Convert.ToDateTime(thoigian.DenNgay);
                }
                catch
                {
                    tempFromDate = DateTime.Now;
                    tempTodate = DateTime.Now;
                }
            }

            List<SqlParameter> param = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@MaDonHang", Value = filter.MaDonHang + ""},
                new SqlParameter { ParameterName = "@ThuNgan", Value = filter.ThuNgan == null || filter.ThuNgan.Length == 0 ? "" : string.Join(',', filter.ThuNgan)},
                new SqlParameter { ParameterName = "@PhucVu", Value = filter.PhucVu == null || filter.PhucVu.Length == 0 ? "" :   string.Join(',', filter.PhucVu)},
                new SqlParameter { ParameterName = "@KH", Value = filter.KhachHang == null || filter.KhachHang.Length == 0 ? "" :  string.Join(',', filter.KhachHang)},
                new SqlParameter { ParameterName = "@KhuVuc", Value = filter.KhuVuc == null || filter.KhuVuc.Length == 0 ? "" :  string.Join(',', filter.KhuVuc)},
                new SqlParameter { ParameterName = "@TinhTrangDH", Value = filter.TinhTrangDH == null || filter.TinhTrangDH.Length == 0 ? "" :  string.Join(',', filter.TinhTrangDH)},
                new SqlParameter { ParameterName = "@PTTT", Value = filter.PhuongThucThanhToan == null || filter.PhuongThucThanhToan.Length == 0 ? "" :  string.Join(',', filter.PhuongThucThanhToan)},
                new SqlParameter { ParameterName = "@ToDate", Value = tempTodate.ToString("yyyy/MM/dd") + " 23:59:59"},
                new SqlParameter { ParameterName = "@FromDate", Value = tempFromDate.ToString("yyyy/MM/dd") + "  00:00:00"},
            };
            string query = "EXEC dbo.GetListHoaDon @DonVi, @MaDonHang, @ThuNgan, @PhucVu, @KH, @KhuVuc, @TinhTrangDH, @PTTT , @ToDate, @FromDate";
            var data = EfSqlHelper.FromSqlQuery<BillResponse>(_dbContext, query, param);
      
            return data;
        }

        public async Task<OrderedList> GetTableOrdered(int tableId, int? donVi)
        {
            var result = new OrderedList();
            if (tableId == 0) return result;

            var donHang = _dbContext.T_DonHang.FirstOrDefault(x => x.Ma_Ban == tableId && x.DonVi == donVi && x.TinhTrangDonHang == (int)TINHTRANGDONHANG.TAO_DON_HANG);
            if (donHang != null)
            {
                var query = from donhang in _dbContext.T_DonHang
                            join ctdh in _dbContext.T_DonHangChiTiet on donhang.MaDonHang equals ctdh.MaDonHang
                            join mh in _dbContext.M_MatHang on ctdh.Ma_MH equals mh.Ma_MH
                            where donhang.Ma_Ban == tableId && ctdh.DonVi == donVi && donhang.DonVi == donVi && donhang.TinhTrangDonHang == (int)TINHTRANGDONHANG.TAO_DON_HANG
                            select new ItemMatHangDH
                            {
                                Id = ctdh.Ma_MH,
                                SoLuong = ctdh.SoLuong_MH,
                                Ma_MH_Goc = ctdh.Ma_MH_Goc,
                                GhiChu = ctdh.GhiChu + "",
                                NoiDungGiamGia = ctdh.NoiDungGiamGia_MH,
                                Ten_MH = mh.Ten_MH,
                                Gia_Ban = ctdh.DonGia_MH,
                                GioVao = ctdh.GioVao,
                                GioRa = ctdh.GioRa,
                                Amount = donhang.ThanhTien_DonHang,
                                SoDonHang = ctdh.SoDonHang,
                                LoaiChietKhau = ctdh.LoaiChietKhau,
                                TienGiamGia_DH= ctdh.TienGiamGia_DH,
                                PhanTramGiam_DH= ctdh.PhanTramGiam_DH,
                                LoaiThoiGianApDung= mh.LoaiThoiGianApDung,
                                ThoiGianApDung = mh.ThoiGianApDung,
                                Id_LoaiMH = mh.Loai_MH.Value,
                                QRCode = mh.QRCode,
                                ChietKhau = new ChietKhauItem
                                {
                                    LoaiCk = ctdh.PhanTramGiamGia_MH > 0 ? (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM : (int)GIA_TRI_CHIET_KHAU.SO_TIEN,
                                    ValueCk = ctdh.PhanTramGiamGia_MH > 0 ? ctdh.PhanTramGiamGia_MH : ctdh.TienGiamGia_MH
                                },
                                Ma_DanhMuc = mh.Ma_DanhMuc.Value
                            };
                var ban = _dbContext.M_Ban.FirstOrDefault(x => x.DonVi == donVi && x.Ma_Ban == donHang.Ma_Ban);
                var khuVuc = _dbContext.M_Outlet.FirstOrDefault(x => x.DonVi == donVi && x.Ma_Outlet == ban.Ma_Outlet);

                decimal maxKM = 0;
                if (donHang.MaKhuyenMai > 0)
                {
                    var km = _dbContext.M_KhuyenMai.FirstOrDefault(x => x.DonVi == donVi && x.MaKhuyenMai == donHang.MaKhuyenMai);
                    if (km != null)
                    {
                        maxKM = km.MaxKhuyenMai;
                    }
                }

                result.KhuVuc = string.Format("{0} - {1}", khuVuc.Ten_Outlet, ban.Ten_Ban);
                result.MatHangList = query.ToList();
                result.SoDonHang = donHang.SoDonHang;
                result.MaDonHang = donHang.MaDonHang;
                result.GhiChu = donHang.NoiDungGhiChu;
                result.MaKhachHang = donHang.Ma_KhachHang;
                result.MaKhuyenMai = donHang.MaKhuyenMai;
                result.TableNo = donHang.Ma_Ban;
                result.GioVao = donHang.ThoiGianTao;
                result.LoaiDonHang = donHang.LoaiDonHang;
                result.Timestamp = BitConverter.ToUInt64(donHang.Timestamp, 0).ToString();
                (int phanTramck, decimal giaTriCk) = CalculatorTotalCkMH(result.MatHangList);
                if (donHang.PhanTram_Giam > 0)
                {
                    phanTramck = donHang.PhanTram_Giam;
                }
                result.ChietKhauBill = new ChietKhauItem
                {
                    LoaiCk = phanTramck > 0 ? (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM : (int)GIA_TRI_CHIET_KHAU.SO_TIEN,
                    ValueCk = phanTramck > 0 ? phanTramck : giaTriCk,
                    MaxValue = maxKM 
                };
            }
            return result;
        }
        public async Task<OrderedList> GetTableOrderedNew(string maDh, int? donVi)
        {
            var result = new OrderedList();
            if (string.IsNullOrEmpty(maDh)) return result;

            var donHang = _dbContext.T_DonHang.FirstOrDefault(x => x.MaDonHang == maDh && x.DonVi == donVi && x.TinhTrangDonHang == (int)TINHTRANGDONHANG.TAO_DON_HANG);
            if (donHang != null)
            {
                var query = from donhang in _dbContext.T_DonHang
                            join ctdh in _dbContext.T_DonHangChiTiet on donhang.MaDonHang equals ctdh.MaDonHang
                            join mh in _dbContext.M_MatHang on ctdh.Ma_MH equals mh.Ma_MH
                            where donhang.MaDonHang == maDh && ctdh.DonVi == donVi && donhang.DonVi == donVi && donhang.TinhTrangDonHang == (int)TINHTRANGDONHANG.TAO_DON_HANG
                            select new ItemMatHangDH
                            {
                                Id = ctdh.Ma_MH,
                                SoLuong = ctdh.SoLuong_MH,
                                Ma_MH_Goc = ctdh.Ma_MH_Goc,
                                GhiChu = ctdh.GhiChu + "",
                                NoiDungGiamGia = ctdh.NoiDungGiamGia_MH,
                                Ten_MH = mh.Ten_MH,
                                Gia_Ban = ctdh.DonGia_MH,
                                GioVao = ctdh.GioVao,
                                GioRa = ctdh.GioRa,
                                Amount = donhang.ThanhTien_DonHang,
                                SoDonHang = ctdh.SoDonHang,
                                LoaiChietKhau = ctdh.LoaiChietKhau,
                                TienGiamGia_DH = ctdh.TienGiamGia_DH,
                                PhanTramGiam_DH = ctdh.PhanTramGiam_DH,
                                LoaiThoiGianApDung = mh.LoaiThoiGianApDung,
                                MaDonHang = donhang.MaDonHang,
                                ThoiGianApDung = mh.ThoiGianApDung,
                                Id_LoaiMH = mh.Loai_MH.Value,
                                QRCode = mh.QRCode,
                                ChietKhau = new ChietKhauItem
                                {
                                    LoaiCk = ctdh.PhanTramGiamGia_MH > 0 ? (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM : (int)GIA_TRI_CHIET_KHAU.SO_TIEN,
                                    ValueCk = ctdh.PhanTramGiamGia_MH > 0 ? ctdh.PhanTramGiamGia_MH : ctdh.TienGiamGia_MH
                                },
                                Ma_DanhMuc = mh.Ma_DanhMuc.Value
                            };
                var ban = _dbContext.M_Ban.FirstOrDefault(x => x.DonVi == donVi && x.Ma_Ban == donHang.Ma_Ban);
                var khuVuc = _dbContext.M_Outlet.FirstOrDefault(x => x.DonVi == donVi && x.Ma_Outlet == ban.Ma_Outlet);

                decimal maxKM = 0;
                if (donHang.MaKhuyenMai > 0)
                {
                    var km = _dbContext.M_KhuyenMai.FirstOrDefault(x => x.DonVi == donVi && x.MaKhuyenMai == donHang.MaKhuyenMai);
                    if (km != null)
                    {
                        maxKM = km.MaxKhuyenMai;
                    }
                }

                result.KhuVuc = string.Format("{0} - {1}", khuVuc.Ten_Outlet, ban.Ten_Ban);
                result.MatHangList = query.ToList();
                result.SoDonHang = donHang.SoDonHang;
                result.MaDonHang = donHang.MaDonHang;
                result.GhiChu = donHang.NoiDungGhiChu;
                result.MaKhachHang = donHang.Ma_KhachHang;
                result.MaKhuyenMai = donHang.MaKhuyenMai;
                result.TableNo = donHang.Ma_Ban;
                result.GioVao = donHang.ThoiGianTao;
                result.LoaiDonHang = donHang.LoaiDonHang;
                result.Timestamp = BitConverter.ToUInt64(donHang.Timestamp, 0).ToString();
                (int phanTramck, decimal giaTriCk) = CalculatorTotalCkMH(result.MatHangList);
                if (donHang.PhanTram_Giam > 0)
                {
                    phanTramck = donHang.PhanTram_Giam;
                }
                result.ChietKhauBill = new ChietKhauItem
                {
                    LoaiCk = phanTramck > 0 ? (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM : (int)GIA_TRI_CHIET_KHAU.SO_TIEN,
                    ValueCk = phanTramck > 0 ? phanTramck : giaTriCk,
                    MaxValue = maxKM
                };
            }
            return result;
        }
        private (int, decimal) CalculatorTotalCkMH(List<ItemMatHangDH> listMh)
        {
            decimal totalTienGiamDH = 0;
            int phanTramCk = 0;
            foreach (var item in listMh)
            {
                totalTienGiamDH += item.TienGiamGia_DH;
            }
            return (phanTramCk, Math.Round(totalTienGiamDH));
        }

        public async Task<IEnumerable<HoaDonKHModelResponse>> GetHoaDonKhachHang(int id, int ma_KH)
        {
            var result = (from dh in _dbContext.T_DonHang
                          join user in _dbContext.M_User.Where(x => x.DonVi == id && x.Deleted == 0) on dh.CreateBy equals user.UserName
                          where dh.DonVi == id && dh.Deleted == 0 && dh.TinhTrangDonHang == 2 && dh.Ma_KhachHang == ma_KH
                          select new HoaDonKHModelResponse
                         {
                             Id = dh.SoDonHang,
                             SoDonHang = dh.SoDonHang,
                             MaDonHang = dh.MaDonHang,
                             Ngay_DonHang = dh.Ngay_DonHang,
                             ThanhTien_DonHang = dh.ThanhTien_DonHang,
                             ThoiGianThanhToan = dh.ThoiGianThanhToan,
                             ThuNgan = user.FullName,
                             TinhTrangDon = "Hoàn Tất" ,
                         }).OrderByDescending(x => x.SoDonHang).ToList();
            return result;
        }
        #region BAO CAO DOANH THU
        public async Task<DoanhThuTongQuanResponse> GetBaoCaoDoanhThuTongQuan(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            DoanhThuTongQuanResponse data = new DoanhThuTongQuanResponse();

            string sql = "EXEC dbo.dttq_DoanhThuTheoGio @DonVi, @ToDate, @FromDate";
            var dtTheoGio = EfSqlHelper.FromSqlQuery<DoanhThuTheoGio>(_dbContext, sql, parms);


            data.DtTheoGio = dtTheoGio;

            List<SqlParameter> parms2 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_TongSoHoaDon = "EXEC dbo.dttq_TongSoHoaDon @DonVi, @ToDate, @FromDate";
            var tongSoHoaDon = EfSqlHelper.FromSqlQuery<DoanhThuTongQuanResponse>(_dbContext, dttq_TongSoHoaDon, parms2);
            data.SoDonHang = tongSoHoaDon.FirstOrDefault()?.SoDonHang;


            List<SqlParameter> parms3 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_SoLuongMH = "EXEC dbo.dttq_SoLuongMH @DonVi, @ToDate, @FromDate";
            var soLuongMH = EfSqlHelper.FromSqlQuery<DoanhThuTongQuanResponse>(_dbContext, dttq_SoLuongMH, parms3);
            data.SoLuongMH = soLuongMH.FirstOrDefault()?.SoLuongMH;

            List<SqlParameter> parms4 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_SoHDHuy = "EXEC dbo.dttq_SoHDHuy @DonVi, @ToDate, @FromDate";
            var SoHDHuy = EfSqlHelper.FromSqlQuery<DoanhThuTongQuanResponse>(_dbContext, dttq_SoHDHuy, parms4);
            data.SoHDHuy = SoHDHuy.FirstOrDefault()?.SoDonHang;

            List<SqlParameter> parms5 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_TheoNgay = "EXEC dbo.dttq_DoanhThuTheoNgay @DonVi, @ToDate, @FromDate";
            var ddtTheoNgay = EfSqlHelper.FromSqlQuery<DoanhThuTheoNgay>(_dbContext, dttq_TheoNgay, parms5);
            data.DtTheoNgay = ddtTheoNgay;

            return data;
        }

        public async Task<DoanhThuHTTTResponse> GetBaoCaoDoanhThuHTTT(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            DoanhThuHTTTResponse data = new DoanhThuHTTTResponse();
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_httt_DS = "EXEC dbo.dttq_DoanhThuTheoHTTT_DoanhSo @DonVi, @ToDate, @FromDate";
            var doanhSo = EfSqlHelper.FromSqlQuery<HTTTDoanhSo>(_dbContext, dttq_httt_DS, parms);
            data.DoanhSo = doanhSo;

            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_httt_HD = "EXEC dbo.dttq_DoanhThuTheoHTTT_HoaDon @DonVi, @ToDate, @FromDate";
            var hoaDon = EfSqlHelper.FromSqlQuery<HTTTHoaDon>(_dbContext, dttq_httt_HD, parms1);
            data.HoaDon = hoaDon;
            
            List<SqlParameter> parms2 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_httt_detail = "EXEC dbo.dttq_DoanhThuTheoHTTT_Detail @DonVi, @ToDate, @FromDate";
            var detail = EfSqlHelper.FromSqlQuery<HTTTDetail>(_dbContext, dttq_httt_detail, parms2);
            data.HTTTDetails = detail;

            return data;
        }

        public async Task<DoanhThuThuNganResponse> GetBaoCaoDoanhThuNgan(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            DoanhThuThuNganResponse data = new DoanhThuThuNganResponse();
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_httt_DS = "EXEC dbo.dttq_DoanhThuTheoThuNgan @DonVi, @ToDate, @FromDate";
            var tn = EfSqlHelper.FromSqlQuery<DTThuNgan>(_dbContext, dttq_httt_DS, parms);
            data.DtThuNgan = tn;

            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_TN_detail = "EXEC dbo.dttq_DoanhThuTheoThuNgan_Detail @DonVi, @ToDate, @FromDate";
            var detail = EfSqlHelper.FromSqlQuery<DTThuNgan>(_dbContext, dttq_TN_detail, parms1);
            data.DtThuNganDetails = detail;

            return data;
        }

        public async Task<DoanhThuPhucVuResponse> GetBaoCaoDoanhThuPhucVu(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            DoanhThuPhucVuResponse data = new DoanhThuPhucVuResponse();
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_pv = "EXEC dbo.dttq_DoanhThuTheoPhuVu @DonVi, @ToDate, @FromDate";
            var pv = EfSqlHelper.FromSqlQuery<DtPhuVu>(_dbContext, dttq_pv, parms);
            data.DtPhuVu = pv;

            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_PV_detail = "EXEC dbo.dttq_DoanhThuTheoPhuVu_Detail @DonVi, @ToDate, @FromDate";
            var detail = EfSqlHelper.FromSqlQuery<DtPhuVu>(_dbContext, dttq_PV_detail, parms1);
            data.DtPhuVuDetails = detail;

            return data;
        }

        public async Task<DoanhThuLoaiDHResponse> GetBaoCaoDoanhThuLoaiDH(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            DoanhThuLoaiDHResponse data = new DoanhThuLoaiDHResponse();
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_loaiHD = "EXEC dbo.dttq_DoanhThuTheoLoaiDH @DonVi, @ToDate, @FromDate";
            var pv = EfSqlHelper.FromSqlQuery<DtLoaiDH>(_dbContext, dttq_loaiHD, parms);
            data.DtLoaiDH = pv;

            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_loaiHD_detail = "EXEC dbo.dttq_DoanhThuTheoLoaiDH_Detail @DonVi, @ToDate, @FromDate";
            var detail = EfSqlHelper.FromSqlQuery<DtLoaiDH>(_dbContext, dttq_loaiHD_detail, parms1);
            data.DtLoaiDHDetails = detail;

            return data;
        }

        public async Task<IEnumerable<DoanhThuDHHuyResponse>> GetBaoCaoDoanhThuDHHuy(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dttq_Huy = "EXEC dbo.dttq_DoanhThuTheoHuyHD @DonVi, @ToDate, @FromDate";
            var data = EfSqlHelper.FromSqlQuery<DoanhThuDHHuyResponse>(_dbContext, dttq_Huy, parms);

            return data;
        }
        #endregion

        #region BAO CAO MAT HANG

        public async Task<DanhMucMatHangResponse> GetBaoCaoDanhMucMH(int donVi, string thoiGian, string from, string to)
        {
            DanhMucMatHangResponse data = new DanhMucMatHangResponse();

            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dmmh_detail = "EXEC dbo.bcmh_DanhMuc_Detail @DonVi, @ToDate, @FromDate";
            var mdmhDetail = EfSqlHelper.FromSqlQuery<DanhMucMatHangDetail>(_dbContext, dmmh_detail, parms);
            data.Details = mdmhDetail;


            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dmmh_hoadon = "EXEC dbo.bcmh_DanhMuc_HoaDon @DonVi, @ToDate, @FromDate";
            var hoadon = EfSqlHelper.FromSqlQuery<DanhMucMatHangTheoHoaDon>(_dbContext, dmmh_hoadon, parms1);
            data.HoaDons = hoadon;


            List<SqlParameter> parms2 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dmmh_doanSo = "EXEC dbo.bcmh_DanhMuc_DoanhSo @DonVi, @ToDate, @FromDate";
            var doanhSo = EfSqlHelper.FromSqlQuery<DanhMucMatHangTheoDoanhSo>(_dbContext, dmmh_doanSo, parms2);
            data.DoanhSos = doanhSo;

            return data;
        }

        public async Task<MatHangBanChayResponse> GetBaoCaoMHBanChay(int donVi, string thoiGian, string from, string to)
        {
            MatHangBanChayResponse data = new MatHangBanChayResponse();

            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dmmh_detail = "EXEC dbo.bcmh_BanChay_Detail @DonVi, @ToDate, @FromDate";
            var mdmhDetail = EfSqlHelper.FromSqlQuery<MatHangBanChayDetail>(_dbContext, dmmh_detail, parms);
            data.Details = mdmhDetail;


            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dmmh_ds = "EXEC dbo.bcmh_BanChay_DoanhSo @DonVi, @ToDate, @FromDate";
            var ds = EfSqlHelper.FromSqlQuery<MatHangBanChayDetail>(_dbContext, dmmh_ds, parms1);
            data.DoanhSos = ds;


            List<SqlParameter> parms2 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dmmh_hd = "EXEC dbo.bcmh_BanChay_HoaDon @DonVi, @ToDate, @FromDate";
            var hd = EfSqlHelper.FromSqlQuery<MatHangBanChayHoaDon>(_dbContext, dmmh_hd, parms2);
            data.HoaDons = hd;
            return data;
        }

        public async Task<IEnumerable<MatHangDaHuyResponse>> GetBaoCaoMHDaHuy(int donVi, string thoiGian, string from, string to)
        {

            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dmmh_hd = "EXEC dbo.bcmh_DaHuy @DonVi, @ToDate, @FromDate";
            var data = EfSqlHelper.FromSqlQuery<MatHangData>(_dbContext, dmmh_hd, parms);
            var test = data.ToList();
            var idx = 1;
            var danhmuc = test.DistinctBy(x => x.Ma_DanhMuc).Select(group => new MatHangDaHuyResponse
            {
                Ma_DanhMuc = group.Ma_DanhMuc,
                Ten_DanhMuc = group.Ten_DanhMuc,
                TotalDM = test.Where(x => x.Ma_DanhMuc == group.Ma_DanhMuc).Sum(x => x.SoLuong_MH),
                MatHangDatas = data.Where(x => x.Ma_DanhMuc == group.Ma_DanhMuc).DistinctBy(x=>x.Ma_MH).Select(x => new MatHangData
                {
                    STT = idx++,
                    SoLuong_MH = x.SoLuong_MH,
                    Ma_DanhMuc = x.Ma_DanhMuc,
                    Ma_MH = x.Ma_MH,
                    Ten_MH = x.Ten_MH,
                    TotalMh = test.Where(y => y.Ma_MH == x.Ma_MH && y.Ma_DanhMuc == x.Ma_DanhMuc).Sum(x=>x.SoLuong_MH),
                    ItemMhs = test.Where(y => y.Ma_MH == x.Ma_MH && y.Ma_DanhMuc == x.Ma_DanhMuc).Select(z => new ItemMh
                    {
                        Ten_MH = z.Ten_MH,
                        Ma_MH = x.Ma_MH,
                        MaDonHang = z.MaDonHang,
                        GhiChu = z.GhiChu,
                        SoLuong_MH = z.SoLuong_MH
                    })
                }).ToList()
            });
            return danhmuc;
        }
        #endregion

        #region BAO CAO KQ KINH DOANH
        public async Task<KetQuaKDResponse> GetBaoCaoKQKD(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);
            (string toDateSS, string fromDateSS) = HandleStringThoiGianKySoSanh(thoiGian, from, to);

            KetQuaKDResponse ketQuaKDResponse = new KetQuaKDResponse();

            // Get danh mục thu chi kỳ hiện tại
            ketQuaKDResponse.KyHienTai = GetDataTaiChinhTongHop(donVi, fromDate, toDate);
            ketQuaKDResponse.KySoSanh = GetDataTaiChinhTongHop(donVi, fromDateSS, toDateSS);

            ketQuaKDResponse.ThuNhap = PrepareData(ketQuaKDResponse.KyHienTai.ThuNhap, ketQuaKDResponse.KySoSanh.ThuNhap);
            ketQuaKDResponse.ChiPhi = PrepareData(ketQuaKDResponse.KyHienTai.ChiPhi, ketQuaKDResponse.KySoSanh.ChiPhi);
            return ketQuaKDResponse;
        }
        private IEnumerable<DanhMucThuChiTongHop> PrepareData(IEnumerable<DanhMucThuChi> hienTai, IEnumerable<DanhMucThuChi> soSanh)
        {

            List<DanhMucThuChiTongHop> data = new List<DanhMucThuChiTongHop>();
            if (hienTai != null && hienTai.Count() > 0)
            {
                foreach (var item in hienTai)
                {

                    var t = new DanhMucThuChiTongHop();
                    t.Ten_DanhMucThuChi = item.Ten_DanhMucThuChi;
                    t.GiaTriKyHienTai = item.GiaTriThuChi;
                    data.Add(t);
                }
            }

            if (soSanh != null && soSanh.Count() > 0)
            {
                foreach (var item in soSanh)
                {
                    var t = new DanhMucThuChiTongHop();
                    var itemChecked = data.FirstOrDefault(x => x.Ten_DanhMucThuChi == item.Ten_DanhMucThuChi);
                    if (itemChecked == null)
                    {
                        t.Ten_DanhMucThuChi = item.Ten_DanhMucThuChi;
                        t.GiaTriKySoSanh = item.GiaTriThuChi;
                        t.GiaTriKyHienTai = 0;
                        data.Add(t);
                    }
                    else
                    {
                        itemChecked.GiaTriKySoSanh = item.GiaTriThuChi;
                    }
                }
            }
            return data;
        }
        private TaiChinhTongHop GetDataTaiChinhTongHop(int donVi, string fromDate, string toDate)
        {
            TaiChinhTongHop ky = new TaiChinhTongHop();
            ky.ThuNhap = GetDataThuChi(donVi, fromDate, toDate, 1);
            ky.ChiPhi = GetDataThuChi(donVi, fromDate, toDate, 2);
            ky.DoanhThuBanHang = GetDoanhThuBanHang(donVi, fromDate, toDate);
            ky.DoanhThuGiamTru = GetDoanhThuGiamTru(donVi, fromDate, toDate);
            return ky;
        }

        private DoanhThuBanHang GetDoanhThuBanHang(int donVi, string fromDate, string toDate)
        {
            DoanhThuBanHang doanhThuBanHang = new DoanhThuBanHang();
            var tienDH = _dbContext.T_DonHang.Where(x => x.DonVi == donVi && x.Ngay_DonHang >= Convert.ToDateTime(fromDate).Date && x.Ngay_DonHang <= Convert.ToDateTime(toDate).Date).Select(x=>x.Tien_DonHang).Sum();
            var tienThue = _dbContext.T_DonHang.Where(x => x.DonVi == donVi && x.Ngay_DonHang >= Convert.ToDateTime(fromDate).Date && x.Ngay_DonHang <= Convert.ToDateTime(toDate).Date).Select(x=>x.Tien_Thue).Sum();

            doanhThuBanHang.TienHang = Math.Round(tienDH);
            doanhThuBanHang.TienThue = Math.Round(tienThue);

            return doanhThuBanHang;
        }

        private DoanhThuGiamTru GetDoanhThuGiamTru(int donVi, string fromDate, string toDate)
        {
            DoanhThuGiamTru doanhThuGiamTru = new DoanhThuGiamTru();

            var giamGia = _dbContext.T_DonHang.Where(x => x.DonVi == donVi && x.Ngay_DonHang >= Convert.ToDateTime(fromDate).Date && x.Ngay_DonHang <= Convert.ToDateTime(toDate).Date).Select(x => x.Tien_Giam).Sum();
            var tienHuy = _dbContext.T_DonHang.Where(x => x.DonVi == donVi && x.Deleted == 1 && x.Ngay_DonHang >= Convert.ToDateTime(fromDate).Date && x.Ngay_DonHang <= Convert.ToDateTime(toDate).Date).Select(x => x.Tien_DonHang).Sum();

            doanhThuGiamTru.GiamGia = Math.Round(giamGia);
            doanhThuGiamTru.HuyHoan = Math.Round(tienHuy);

            return doanhThuGiamTru;
        }

        private IEnumerable<DanhMucThuChi> GetDataThuChi(int donVi, string fromDate, string toDate, int loaiThuChi)
        {
            List<SqlParameter> paramPC = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@Loai_PhieuThuChi", Value = loaiThuChi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            string dm_Chi = "EXEC bctc_GetBaoCaoThuChi @DonVi, @Loai_PhieuThuChi, @ToDate, @FromDate";
            return EfSqlHelper.FromSqlQuery<DanhMucThuChi>(_dbContext, dm_Chi, paramPC);
        }

        #endregion
        public Task<IEnumerable<LoiNhuanTheoMHResponse>> GetBaoCaoLoiNhuanTheoMH(int donVi, string thoiGian, string from, string to)
        {
            (string toDate, string fromDate) = HandleStringThoiGian(thoiGian, from, to);

            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@DonVi", Value = donVi},
                new SqlParameter { ParameterName = "@ToDate", Value = toDate},
                new SqlParameter { ParameterName = "@FromDate", Value = fromDate},
            };
            //string dmmh_hd = "EXEC dbo.bcmh_DaHuy @DonVi, @ToDate, @FromDate";
            //var data = EfSqlHelper.FromSqlQuery<MatHangData>(_dbContext, dmmh_hd, parms);

            throw new NotImplementedException();
        }

        /// <summary>
        /// Handle thời gian kỳ bình thường
        /// </summary>
        /// <param name="thoiGian"></param>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        (string, string) HandleStringThoiGian(string thoiGian, string from, string to)
        {
            DateTime current = DateTime.Now.Date;

            int year = 0;
            string fromDate = "";
            string toDate = "";

            DateTime startDate;
            DateTime endDate;
            switch (thoiGian)
            {
                case "HOMQUA":
                    toDate = fromDate = current.AddDays(-1).ToString("yyyy-MM-dd");
                    break;

                case "TUAN":
                    DateTime startOfWeek = current.AddDays((((int)(current.DayOfWeek) + 6) % 7) * -1);
                    DateTime endOfWeek = startOfWeek.AddDays(7);
                    fromDate = startOfWeek.Date.ToString("yyyy-MM-dd");
                    toDate = endOfWeek.ToString("yyyy-MM-dd");

                    break;

                case "THANG":
                    DateTime now = DateTime.Now;
                    startDate = new DateTime(now.Year, now.Month, 1);
                    endDate = startDate.AddMonths(1).AddDays(-1);

                    fromDate = startDate.Date.ToString("yyyy-MM-dd");
                    toDate = endDate.AddDays(6).ToString("yyyy-MM-dd");
                    break;

                case "NAM":
                    year = current.Year;
                    startDate = new DateTime(year, 1, 1);
                    endDate = new DateTime(year, 12, 31);

                    fromDate = startDate.Date.ToString("yyyy-MM-dd");
                    toDate = endDate.Date.ToString("yyyy-MM-dd");
                    break;

                case "THOIGIANKHAC":
                    toDate = to;
                    fromDate = from;
                    break;

                default:
                    toDate = fromDate = current.ToString("yyyy-MM-dd");
                    break;
            }
            return (toDate + " 23:59:59", fromDate + " 00:00:00");
        }

        /// <summary>
        /// Handle thời gian kỳ so sánh
        /// </summary>
        /// <param name="thoiGian"></param>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        (string, string) HandleStringThoiGianKySoSanh(string thoiGian, string from, string to)
        {
            DateTime current = DateTime.Now.Date;

            int year = 0;
            string fromDate = "";
            string toDate = "";

            DateTime startDate;
            DateTime endDate;
            switch (thoiGian)
            {
                case "HOMQUA":
                case "TUAN":
                case "THANG":
                case "HOMNAY":
                    year = current.Year;
                    startDate = new DateTime(year, 1, 1);
                    fromDate = startDate.Date.ToString("yyyy-MM-dd");
                    toDate = current.ToString("yyyy-MM-dd");
                    break;

                case "NAM":
                    year = current.Year - 1;
                    startDate = new DateTime(year, 1, 1);
                    endDate = new DateTime(year, 12, 31);

                    fromDate = startDate.Date.ToString("yyyy-MM-dd");
                    toDate = endDate.Date.ToString("yyyy-MM-dd");
                    break;

                case "THOIGIANKHAC":
                    toDate = Convert.ToDateTime(to).AddYears(-1).ToString("yyyy-MM-dd");
                    fromDate = Convert.ToDateTime(from).AddYears(-1).ToString("yyyy-MM-dd");
                    break;
            }
            return (toDate + " 23:59:59", fromDate + " 00:00:00");
        }
    }
}
