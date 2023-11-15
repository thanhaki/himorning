using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.OpenApi.Models;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Reflection.Metadata;
using System.Security.Claims;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Application.Features.DonHang.Commands
{
    public class AddDonHangCommand
    {
        public class AddDonHangRequest : IRequest<ResponseBase>
        {
            public ChietKhauItem ChietKhau { get; set; }
            public List<ItemMatHangDH> OrderedList { get; set; }
            public int DonVi { set;get; }
            public int TableNo { set;get; }
            public int LoaiDonHang { set;get; }
            public string? UserName { set;get; }
            public int SoDonHang { set;get;}
            public string? MaDonHang { set;get;}
            public string? Timestamp { get; set; }
            public string? GhiChu { get; set; }
            public int MaKhachHang { set; get; }
            public bool? TamNgungTinhGio { set; get; }
            public int? MaKhuyenMai { set; get; } = 0;
            public string? ActionFrom { set; get; }
        }

        public class Handler : IRequestHandler<AddDonHangRequest, ResponseBase>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IDonHangChiTietRepository _donHangChiTietRepository;
            private readonly IMatHangRepository _matHangRepository;
            private readonly IKhuyenMaiRepository _khuyenMaiRepository;
            private readonly IKhuyenMaiApDungRepository _khuyenMaiApDungRepository;
            private readonly IKhuyenMaiDoiTuongRepository _khuyenMaiDoiTuongRepository;
            private readonly IKhuyenMaiKTGRepository _khuyenMaiKTGRepository;
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddDonHangCommand> _logger;

            private bool IsApplyKhuyenMai { set; get; } = false;
            private string ContentKhuyenMai { set; get; }
            public Handler(
                IDonHangRepository donHangRepository,
                IMapper mapper, ILogger<AddDonHangCommand> logger,
                IDonHangChiTietRepository donHangChiTietRepository,
                IMatHangRepository matHangRepository,
                IKhuyenMaiRepository khuyenMaiRepository, 
                IKhuyenMaiApDungRepository khuyenMaiApDungRepository,
                IKhachHangRepository khachHangRepository,
                IKhuyenMaiDoiTuongRepository khuyenMaiDoiTuongRepository, 
                IKhuyenMaiKTGRepository khuyenMaiKTGRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donHangChiTietRepository = donHangChiTietRepository ?? throw new ArgumentNullException(nameof(donHangChiTietRepository));
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _khuyenMaiRepository = khuyenMaiRepository ?? throw new ArgumentNullException(nameof(khuyenMaiRepository));
                _khuyenMaiApDungRepository = khuyenMaiApDungRepository ?? throw new ArgumentNullException(nameof(khuyenMaiApDungRepository));
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _khuyenMaiDoiTuongRepository = khuyenMaiDoiTuongRepository ?? throw new ArgumentNullException(nameof(khuyenMaiDoiTuongRepository));
                _khuyenMaiKTGRepository = khuyenMaiKTGRepository ?? throw new ArgumentNullException(nameof(khuyenMaiKTGRepository));
            }

            public async Task<ResponseBase> Handle(AddDonHangRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    T_DonHang? checkDonHang = null;
                    if (!string.IsNullOrEmpty(request.MaDonHang) && request.SoDonHang > 0)
                    {
                        checkDonHang = await GetDonHangById(request.DonVi, request.MaDonHang, request.SoDonHang);
                        if (checkDonHang == null)
                            return new ResponseBase
                            {
                                Status = "-1",
                                Message = "Tạo đơn hàng không thành công"
                            };

                        if (!string.IsNullOrEmpty(request.Timestamp))
                        {
                            var currentTs = BitConverter.ToUInt64(checkDonHang.Timestamp, 0).ToString();
                            if (currentTs != request.Timestamp)
                            return new ResponseBase
                            {
                                Status = "0",
                                Message = "Đơn hàng có sử thay, vui lòng load lại thông tin đơn hàng."
                            };
                        }
                    } 
                    else
                    {
                        checkDonHang = await GetDonHangByMaBan(request.DonVi, request.TableNo);
                        if (checkDonHang != null)
                            return new ResponseBase
                            {
                                Status = "-2",
                                Message = "Bàn đang sử dụng, không thể tạo mới"
                            };
                    }

                    // Add new order
                    if (checkDonHang == null)
                    {
                        _donHangRepository.BeginTransactionAsync();
                        await HandleAddNewOrderAsync(request);
                        _donHangRepository.CommitTransactionAsync();
                    }
                    else
                    {
                        // Update order
                        _donHangRepository.BeginTransactionAsync();
                        await HandleUpdateOrder(request, checkDonHang);
                        _donHangRepository.CommitTransactionAsync();

                        if (request.ActionFrom == "KHUYENMAI" && IsApplyKhuyenMai && request.SoDonHang > 0)
                        {
                            return new ResponseBase
                            {
                                Status = "2",
                                Message = ContentKhuyenMai
                            };
                        }

                        return new ResponseBase
                        {
                            Status = "3",
                            Message = "Cập nhật đơn hàng thành công"
                        };
                    }

                    return new ResponseBase
                    {
                        Status = "1",
                        Message = "Tạo đơn hàng thành công"
                    };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, ex.Message);
                    _donHangRepository.RollbackTransactionAsync();
                    return new ResponseBase
                    {
                        Status = "-1",
                        Message = "Tạo đơn hàng không thành công"
                    };
                }
            }

            #region UPDATE DON HANG DA TAO
            /// <summary>
            /// Update ordred
            /// </summary>
            /// <param name="request"></param>
            /// <param name="donHang"></param>
            /// <returns></returns>
            private async Task HandleUpdateOrder(AddDonHangRequest request, T_DonHang donHang)
            {

                (decimal total, decimal tienGiamMH) = await UpdateDetailOrder(request, donHang);
                // tính chiết khấu

                donHang.Tien_DonHang = total;
                donHang.NoiDungGhiChu = request.GhiChu;
                donHang.Ma_KhachHang = request.MaKhachHang;
                donHang.Tien_Giam = Math.Round(tienGiamMH,0);
                donHang.LoaiDonHang = request.LoaiDonHang;

                donHang.PhanTram_Giam = request.ChietKhau != null && request.ChietKhau.LoaiCk == (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM ? (int)request.ChietKhau.ValueCk : 0;

                donHang.ThanhTien_DonHang = Math.Round(donHang.Tien_DonHang - donHang.Tien_Giam, 0); 
                donHang.ThuNgan = request.UserName;
                donHang.PhucVu = request.UserName;
                donHang.Ma_Ban = request.TableNo;

                donHang.MaKhuyenMai = IsApplyKhuyenMai == true ? request.MaKhuyenMai.Value : 0;
                await _donHangRepository.UpdateAsync(donHang);
            }

            private decimal TotalAmountOriginal(List<ItemMatHangDH> items)
            {
                decimal result = 0;
                foreach(var item in items)
                {
                    result += item.SoLuong * item.Gia_Ban;
                }
                return result;
            }   

            async Task<(decimal, decimal)> UpdateDetailOrder(AddDonHangRequest request, T_DonHang donHang)
            {
                List<T_DonHangChiTiet> addCtdhList = new List<T_DonHangChiTiet>();
                List<T_DonHangChiTiet> updateCtdhList = new List<T_DonHangChiTiet>();
                List<T_DonHangChiTiet> deleteCtdhList = new List<T_DonHangChiTiet>();

                int totalMH = request.OrderedList.Count;
                decimal total = 0;
                decimal TotalTienGiamDH = 0;


                #region Giảm Giá Hóa Đơn

                decimal totalOrginal = TotalAmountOriginal(request.OrderedList);
                
                var km = await LoadKhuyenMai(request, donHang.CreateDate);
                var khachHang = await _khachHangRepository.GetByIdAsync(request.MaKhachHang);

                IEnumerable<int> maKMAD = new List<int>();
                IEnumerable<int> maKMDT = new List<int>();
                if (km != null)
                {
                    if (km.ApDungHoaDon == 1)
                    {
                        maKMDT = await GetDoiTuongKMIds(km);
                        request.ChietKhau = await ConvertKMtoCK(km, totalOrginal, khachHang, maKMDT, donHang.CreateDate);
                    }
                    else
                    {
                        request.ChietKhau = new ChietKhauItem();
                        if (km.ApDungDanhMuc == 1 || km.ApDungMatHang == 1)
                        {
                            maKMDT = await GetDoiTuongKMIds(km);
                            maKMAD = await GetDanhMucIds(km);
                        }
                    }
                }

                #endregion

                foreach (var item in request.OrderedList)
                {
                    var ctdhOld = await GetDonHangChiTietById(request.SoDonHang, request.MaDonHang, item.Id, request.DonVi);
                    (string contentGiamgia, decimal tienGiamGiaMH, int phanTramGiamGia) = await GetNoiDungGiamGia(item, totalOrginal, km, maKMAD, maKMDT, khachHang, donHang.CreateDate);
                    
                    Expression<Func<M_MatHang, bool>> getMH = x=>x.Ma_MH == item.Id && x.DonVi== request.DonVi && x.Deleted == 0;
                    
                    var matHang = await _matHangRepository.GetFirstOrDefaultAsync(getMH);
                    
                    if (ctdhOld != null && matHang != null && matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                    {
                        ctdhOld.GioVao = item.GioVao.Value.RemoveSecond();
                        if (request.TamNgungTinhGio == true)
                        {
                            var now = Utilities.GetDateTimeSystem();
                            ctdhOld.GioRa = now.RemoveSecond();
                        }
                        else 
                        {
                            if (item.GioRa != null)
                            {
                                ctdhOld.GioRa = item.GioRa.Value.RemoveSecond();
                            }
                        }

                        if (ctdhOld.GioRa != null)
                        {
                            TimeSpan span = ctdhOld.GioRa.Value.Subtract(ctdhOld.GioVao.Value);
                            ctdhOld.ThoiGianSuDung = span.TotalMinutes > 0 && span.TotalMinutes < 1 ? 1 : (int)span.TotalMinutes;
                        }
                    }

                    decimal tienGiamDH = 0;
                    int phanTramGiamDH = 0;
                    decimal soThoiGian = 1;
                    string ghiChu = "";
                    if (matHang != null && (
                        matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN && ctdhOld != null && 
                        ctdhOld.GioVao !=null && ctdhOld.GioRa != null)) 
                    {
                        (soThoiGian, ghiChu) = HandleMatHang.SoThoiGianDaSuDung(matHang, ctdhOld.GioVao, ctdhOld.GioRa);
                    }
                    (tienGiamDH, phanTramGiamDH) = TinhToanCkBillMatHang(item, request.ChietKhau, tienGiamGiaMH, totalMH, soThoiGian);

                    // Add new Mh
                    if (ctdhOld == null)
                    {
                        T_DonHangChiTiet ctdhNew = new T_DonHangChiTiet();
                        ctdhNew.SoDonHang = request.SoDonHang;
                        ctdhNew.MaDonHang = request.MaDonHang;
                        ctdhNew.DonVi = request.DonVi;
                        ctdhNew.Ma_MH = item.Id;
                        ctdhNew.Ten_MH = item.Ten_MH;
                        ctdhNew.SoLuong_MH = item.SoLuong;
                        ctdhNew.Ma_MH_Goc = item.Ma_MH_Goc == null ? 0 : item.Ma_MH_Goc;

                        ctdhNew.NoiDungGiamGia_MH = contentGiamgia;
                        ctdhNew.TienGiamGia_MH = tienGiamGiaMH;
                        ctdhNew.PhanTramGiamGia_MH = phanTramGiamGia;
                        ctdhNew.DonGia_MH = item.Gia_Ban;
                        ctdhNew.LoaiChietKhau = ReturnTypeChietKhauMatHang(item, request.ChietKhau);

                        ctdhNew.PhanTramGiam_DH = phanTramGiamDH;
                        ctdhNew.TienGiamGia_DH = tienGiamDH;

                        ctdhNew.ThanhTien_MH = (ctdhNew.SoLuong_MH * ctdhNew.DonGia_MH) - ctdhNew.TienGiamGia_MH - ctdhNew.TienGiamGia_DH;

                        if (item.Id_LoaiMH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                        {
                            ctdhNew.GioVao = Utilities.GetDateTimeSystem().RemoveSecond();
                            total += item.GiaMoiPhut * soThoiGian;
                        }
                        else
                        {
                            // Tính toán dữ liệu đơn hàng
                            total += (ctdhNew.SoLuong_MH * ctdhNew.DonGia_MH);
                        }

                        ctdhNew.GhiChu = item.GhiChu;

                        TotalTienGiamDH += ctdhNew.TienGiamGia_MH + ctdhNew.TienGiamGia_DH;
                        addCtdhList.Add(ctdhNew);
                    } 
                    else
                    {
                        // case delete if SoLuong == 0;
                        if (item.SoLuong == 0)
                        {
                            deleteCtdhList.Add(ctdhOld);
                        }
                        else
                        {
                            ctdhOld.SoLuong_MH = item.SoLuong;
                            ctdhOld.Ma_MH_Goc = item.Ma_MH_Goc == null ? 0 : item.Ma_MH_Goc;

                            ctdhOld.NoiDungGiamGia_MH = contentGiamgia;
                            ctdhOld.TienGiamGia_MH = tienGiamGiaMH;
                            ctdhOld.PhanTramGiamGia_MH = phanTramGiamGia;
                            
                            ctdhOld.PhanTramGiam_DH = phanTramGiamDH;
                            ctdhOld.TienGiamGia_DH = tienGiamDH;

                            ctdhOld.LoaiChietKhau = ReturnTypeChietKhauMatHang(item, request.ChietKhau);
                            if (item.Id_LoaiMH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                            {
                                ctdhOld.ThanhTien_MH = (item.GiaMoiPhut * soThoiGian) - ctdhOld.TienGiamGia_MH - ctdhOld.TienGiamGia_DH; ;
                                total += (item.GiaMoiPhut * soThoiGian);
                            }
                            else
                            {
                                ctdhOld.ThanhTien_MH = (ctdhOld.SoLuong_MH * ctdhOld.DonGia_MH) - ctdhOld.TienGiamGia_MH - ctdhOld.TienGiamGia_DH;
                                total += (ctdhOld.SoLuong_MH * ctdhOld.DonGia_MH);
                            }

                            ctdhOld.GhiChu = item.GhiChu;

                            // Tính toán dữ liệu đơn hàng
                            TotalTienGiamDH += ctdhOld.TienGiamGia_MH + ctdhOld.TienGiamGia_DH;
                            // update old Mh
                            updateCtdhList.Add(ctdhOld);
                        }
                    }
                }

                // Add new MatHang
                if (addCtdhList.Count> 0)
                {
                    await _donHangChiTietRepository.AddRangeAsync(addCtdhList);
                }

                // Update SoLuong
                if (updateCtdhList.Count > 0) 
                {
                    await _donHangChiTietRepository.UpdateRangeAsync(updateCtdhList);
                }

                // Delete if Soluong == 0
                if (deleteCtdhList.Count > 0)
                {
                    foreach (var item in deleteCtdhList)
                    {
                        await _donHangChiTietRepository.DeleteAsync(item);
                    }
                }

                return (total, TotalTienGiamDH);
            }

            private async Task<T_DonHangChiTiet> GetDonHangChiTietById(int? SoDonHang, string? MaDonHang, int MaMh, int DonVi)
            {
                Expression<Func<T_DonHangChiTiet, bool>> getById = x => x.MaDonHang == MaDonHang && x.SoDonHang == SoDonHang && x.Ma_MH == MaMh && x.DonVi == DonVi;
                var ctdh = await _donHangChiTietRepository.GetFirstOrDefaultAsync(getById);
                return ctdh;
            }

            private async Task<T_DonHang> GetDonHangById(int donVi, string? maDonHang, int? soDonHang)
            {
                Expression<Func<T_DonHang, bool>> expression = x => x.DonVi == donVi && x.MaDonHang == maDonHang && x.SoDonHang == soDonHang && x.TinhTrangDonHang == (int)TINHTRANGDONHANG.TAO_DON_HANG;
                var dh = await _donHangRepository.GetFirstOrDefaultAsync(expression);
                return dh;
            }

            private async Task<T_DonHang> GetDonHangByMaBan(int donVi, int maBan)
            {
                Expression<Func<T_DonHang, bool>> expression = x => x.DonVi == donVi && x.Ma_Ban == maBan && x.TinhTrangDonHang == (int)TINHTRANGDONHANG.TAO_DON_HANG;
                var dh = await _donHangRepository.GetFirstOrDefaultAsync(expression);
                return dh;
            }
            #endregion

            #region TAO DON HANG MOI

            /// <summary>
            /// Handle create new order.
            /// </summary>
            /// <param name="request"></param>
            /// <returns></returns>
            private async Task HandleAddNewOrderAsync(AddDonHangRequest request)
            {
                T_DonHang t_DonHang = new T_DonHang();

                (string maDH, int soDH) = await GetMaxSoHdAndMaHDAsync(request.DonVi);

                t_DonHang.SoDonHang = soDH;
                t_DonHang.MaDonHang = maDH;
                t_DonHang.NoiDungGhiChu = request.GhiChu;
                t_DonHang.Ma_KhachHang = request.MaKhachHang;

                t_DonHang.TinhTrangDonHang = (int)TINHTRANGDONHANG.TAO_DON_HANG;
                t_DonHang.LoaiDonHang = request.LoaiDonHang;
                t_DonHang.Ma_Ban = request.TableNo;
                t_DonHang.DonVi = request.DonVi;

                t_DonHang.ThoiGianTao = Utilities.GetDateTimeSystem();
                t_DonHang.Ngay_DonHang = Utilities.GetDateTimeSystem();

                t_DonHang.ThuNgan = request.UserName;
                t_DonHang.PhucVu = request.UserName;

                t_DonHang.PhanTram_Thue = 0;
                t_DonHang.Tien_Thue = 0;

                (decimal total, decimal tienGiamDH, List<T_DonHangChiTiet> listMH) = await PrepareDataSaveChiTietDonHangAsync(request, soDH, maDH, request.ChietKhau);
                t_DonHang.Tien_DonHang = total;

                // tính chiết khấu
                t_DonHang.Tien_Giam = Math.Round(tienGiamDH, 0);
                if (request.ChietKhau != null && request.ChietKhau.LoaiCk == (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM)
                {
                    t_DonHang.PhanTram_Giam = (int)request.ChietKhau.ValueCk;
                } else
                {
                    t_DonHang.PhanTram_Giam = 0;
                }

                t_DonHang.ThanhTien_DonHang = Math.Round(t_DonHang.Tien_DonHang - t_DonHang.Tien_Giam, 0);

                await _donHangRepository.AddAsync(t_DonHang);
                await _donHangChiTietRepository.AddRangeAsync(listMH);
            }

            async Task<(string, int)> GetMaxSoHdAndMaHDAsync(int donVi)
            {
                Expression<Func<T_DonHang, bool>> getDHByDonvi = x => x.DonVi == donVi;
                Func<IQueryable<T_DonHang>, IOrderedQueryable<T_DonHang>> orderingMaDH = x => x.OrderByDescending(X => X.MaDonHang);

                Func<IQueryable<T_DonHang>, IOrderedQueryable<T_DonHang>> orderingSoDH = x => x.OrderByDescending(X => X.SoDonHang);

                var t_DonHangByMaDH = await _donHangRepository.GetAsync(getDHByDonvi, orderingMaDH);
                var t_DonHangBySoDH = await _donHangRepository.GetMaxIdAsync(orderingSoDH);

                string maDh = Utilities.FormatCode("HD", 10, "0");
                int soDh = 1;
                if (t_DonHangByMaDH != null && t_DonHangByMaDH.Count > 0)
                {
                    var maxMaDH = t_DonHangByMaDH.Max(x => x.MaDonHang);

                    maDh = Utilities.FormatCode("HD", 10, maxMaDH);
                }
                
                if (t_DonHangBySoDH != null)
                {
                    soDh = t_DonHangBySoDH.SoDonHang + 1;
                }
                return (maDh, soDh);
            }

            async Task<(decimal, decimal, List<T_DonHangChiTiet>)> PrepareDataSaveChiTietDonHangAsync(AddDonHangRequest request, int SoDH, string MaDH, ChietKhauItem ckBill)
            {
                List<T_DonHangChiTiet> itemMatHangs = new List<T_DonHangChiTiet>();
                decimal total = 0;
                decimal tienGiamDh = 0;
                int totalMH = request.OrderedList.Count;
                #region Giảm Giá Hóa Đơn

                decimal totalOrginal = TotalAmountOriginal(request.OrderedList);

                var dateCreateBill = Utilities.GetDateTimeSystem().RemoveSecond();
                var km = await LoadKhuyenMai(request, dateCreateBill);
                var khachHang = await _khachHangRepository.GetByIdAsync(request.MaKhachHang);

                IEnumerable<int> maKMAD = new List<int>();
                IEnumerable<int> maKMDT = new List<int>();
                if (km != null)
                {
                    if (km.ApDungHoaDon == 1)
                    {
                        maKMDT = await GetDoiTuongKMIds(km);
                        request.ChietKhau = await ConvertKMtoCK(km, totalOrginal, khachHang, maKMDT, dateCreateBill);
                    }
                    else
                    {
                        request.ChietKhau = new ChietKhauItem();
                        if (km.ApDungDanhMuc == 1 || km.ApDungMatHang == 1)
                        {
                            maKMDT = await GetDoiTuongKMIds(km);
                            maKMAD = await GetDanhMucIds(km);
                        }
                    }
                }

                #endregion

                foreach (var item in request.OrderedList)
                {
                    var ctdh = new T_DonHangChiTiet();
                    ctdh.SoDonHang = SoDH;
                    ctdh.MaDonHang = MaDH;

                    ctdh.Ma_MH = item.Id;
                    ctdh.Ten_MH = item.Ten_MH;
                    ctdh.SoLuong_MH = item.SoLuong;
                    ctdh.Ma_MH_Goc = item.Ma_MH_Goc == null ? 0 : item.Ma_MH_Goc;

                    (string contentGiamgia, decimal tienGiamGiaMH, int phanTramGiamGia) = await GetNoiDungGiamGia(item, totalOrginal, km, maKMAD, maKMDT, khachHang, dateCreateBill);
                    ctdh.NoiDungGiamGia_MH = contentGiamgia;
                    ctdh.TienGiamGia_MH = tienGiamGiaMH;
                    ctdh.PhanTramGiamGia_MH = phanTramGiamGia;
                    ctdh.DonGia_MH = item.Gia_Ban;

                    if (item.Id_LoaiMH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                    {
                        ctdh.GioVao = dateCreateBill;
                        ctdh.PhanTramGiam_DH = 0;
                        ctdh.TienGiamGia_DH = 0;
                    } 
                    else
                    {
                        (decimal tienGiamDH, int phanTramGiamDH) = TinhToanCkBillMatHang(item, ckBill, tienGiamGiaMH, totalMH, 1);
                        ctdh.PhanTramGiam_DH = phanTramGiamDH;
                        ctdh.TienGiamGia_DH = tienGiamDH;
                        tienGiamDh += ctdh.TienGiamGia_MH + tienGiamDH;
                    }

                    // phân biệt loại chiết khấu
                    ctdh.LoaiChietKhau = ReturnTypeChietKhauMatHang(item, ckBill);

                    ctdh.ThanhTien_MH = (ctdh.SoLuong_MH * ctdh.DonGia_MH) - ctdh.TienGiamGia_MH - ctdh.TienGiamGia_DH;

                    // tính toàn dữ liệu trả về cho T_DonHang
                    total += (ctdh.SoLuong_MH * ctdh.DonGia_MH);

                    ctdh.GhiChu = item.GhiChu;
                    ctdh.DonVi = request.DonVi;
                    itemMatHangs.Add(ctdh);
                }
         
                return (total, tienGiamDh, itemMatHangs);
            }

            private int ReturnTypeChietKhauMatHang(ItemMatHangDH item, ChietKhauItem ckBill)
            {
                var ckMh = item.ChietKhau;

                //  Trường hợp giảm theo 2 HT
                if (ckBill != null && ckBill.ValueCk > 0 && ckMh != null && ckMh.ValueCk > 0)
                {
                    return (int)LOAI_CHIET_KHAU.CHIET_KHAU_BILL_MH;
                }

                //  Trường hợp giảm theo bill
                if (ckBill != null && ckBill.ValueCk > 0)
                {
                    return (int)LOAI_CHIET_KHAU.CHIET_KHAU_BILL;
                }

                // Trường hợp giảm theo SP
                if (ckMh != null && ckMh.ValueCk > 0)
                {
                    return (int)LOAI_CHIET_KHAU.CHIET_KHAU_MH;
                }

                //  Trường hợp đơn thường
                return 0;
            }

            (decimal, int) TinhToanCkBillMatHang(ItemMatHangDH item, ChietKhauItem ckBill, decimal tienGiamMH, int totalMH, decimal soThoiGian)
            {
                decimal tienGiamGia = 0;
                int phanTramGiamGia = 0;
                // Khuyến mãi tối đa
                if (ckBill.MaxValue > 0)
                {
                    decimal values = ckBill.MaxValue / totalMH;
                    tienGiamGia += decimal.Round(values, 2, MidpointRounding.AwayFromZero);
                    phanTramGiamGia += (int)ckBill.ValueCk;
                }
                else
                {
                    if (ckBill.LoaiCk == (int)GIA_TRI_CHIET_KHAU.SO_TIEN)
                    {
                        decimal values = ckBill.ValueCk / totalMH;

                        tienGiamGia += decimal.Round(values, 2, MidpointRounding.AwayFromZero);
                    }

                    if (ckBill.LoaiCk == (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM)
                    {
                        if (ckBill.ValueCk > 0)
                        {
                            if (item.Id_LoaiMH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                            {
                                tienGiamGia += (((item.GiaMoiPhut * soThoiGian) - tienGiamMH) * (int)ckBill.ValueCk) / 100;
                            }
                            else
                            {
                                tienGiamGia += (((item.Gia_Ban * item.SoLuong) - tienGiamMH) * (int)ckBill.ValueCk) / 100;
                            }
                            phanTramGiamGia += (int)ckBill.ValueCk;
                        }
                    }
                }
                return (tienGiamGia, phanTramGiamGia);
            }

            private async Task<IEnumerable<int>> GetDanhMucIds(M_KhuyenMai km)
            {
                var idx = new List<int>();
                Expression<Func<M_KhuyenMai_ApDung, bool>> getKMAP = x => x.SoKhuyenMai == km.SoKhuyenMai && x.DonVi == km.DonVi && x.Deleted == 0;
                var kmAPs = await _khuyenMaiApDungRepository.GetAsync(getKMAP, null);
                if (kmAPs != null && kmAPs.Count > 0)
                {
                    return kmAPs.Select(x => x.SoKhuyenMaiApDung);
                }
                return idx;
            }

            private async Task<IEnumerable<int>> GetDoiTuongKMIds(M_KhuyenMai km)
            {
                var idx = new List<int>();
                Expression<Func<M_KhuyenMai_DoiTuong, bool>> getKMDT = x => x.SoKhuyenMai == km.SoKhuyenMai && x.DonVi == km.DonVi && x.Deleted == 0;
                var kmDTs = await _khuyenMaiDoiTuongRepository.GetAsync(getKMDT, null);
                if (kmDTs != null && kmDTs.Count > 0)
                {
                    return kmDTs.Select(x => x.SoKhuyenMaiDoiTuong);
                }
                return idx;
            }

            private bool IsContainsIDInList(IEnumerable<int> ids, int id)
            {
                if (ids != null && ids.Any())
                    return ids.Contains(id);
                
                return false;
            }

            async Task<(string, decimal, int)> GetNoiDungGiamGia(ItemMatHangDH item, decimal totalOrginal, M_KhuyenMai km, IEnumerable<int> Ma_KM_AD, IEnumerable<int> Ma_KM_DT, M_KhachHang khachHang, DateTime dateCreatedBill)
            {
                string content = "";
                decimal tienGiamGia = 0;
                int phanTramGiamGia = 0;
                // Khuyến mãi danh mục
                if (km != null)
                {
                    if (km.ApDungDanhMuc == 1)
                    {
                        if (IsContainsIDInList(Ma_KM_AD, item.Ma_DanhMuc))
                        {
                            item.ChietKhau = await ConvertKMtoCK(km, totalOrginal, khachHang, Ma_KM_DT, dateCreatedBill);
                        } 
                        else
                        {
                            item.ChietKhau = new ChietKhauItem();
                        }
                    }
                    
                    // Khuyến mãi Mặt hàng
                    if (km.ApDungMatHang == 1)
                    {
                        if (IsContainsIDInList(Ma_KM_AD, item.Id))
                        {
                            item.ChietKhau = await ConvertKMtoCK(km, totalOrginal, khachHang, Ma_KM_DT, dateCreatedBill);
                        }
                        else
                        {
                            item.ChietKhau = new ChietKhauItem();
                        }
                    }
                }

                // Khuyến mãi mặt hàng
                if (item.ChietKhau != null && item.ChietKhau.ValueCk > 0)
                {
                    // Trường hợp Max Khuyến mãi
                    if (item.ChietKhau.MaxValue > 0)
                    {
                        tienGiamGia = item.ChietKhau != null ? item.ChietKhau.MaxValue : 0;
                        if (tienGiamGia > 0)
                        {
                            content = string.Format(@"Giảm giá {0}đ", tienGiamGia.ToString("N0"));
                        }

                        // Gán giá trị % khuyến mãi
                        if (item.ChietKhau?.LoaiCk == (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM)
                        {
                            phanTramGiamGia = item.ChietKhau != null ? (int)item.ChietKhau.ValueCk : 0;
                        }
                    }
                    else
                    {
                        if (item.ChietKhau?.LoaiCk == (int)GIA_TRI_CHIET_KHAU.SO_TIEN)
                        {
                            tienGiamGia = item.ChietKhau != null ? item.ChietKhau.ValueCk : 0;
                            if (tienGiamGia > 0)
                            {
                                content = string.Format(@"Giảm giá {0}đ", tienGiamGia.ToString("N0"));
                            }
                        }

                        if (item.ChietKhau?.LoaiCk == (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM)
                        {
                            if (item.Id_LoaiMH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                            {
                                if (item.GioRa != null && item.GioVao != null)
                                {
                                    phanTramGiamGia = item.ChietKhau != null ? (int)item.ChietKhau.ValueCk : 0;
                                    tienGiamGia = (item.GiaMoiPhut * item.TotalMinus * phanTramGiamGia) / 100;
                                }
                            }
                            else
                            {
                                phanTramGiamGia = item.ChietKhau != null ? (int)item.ChietKhau.ValueCk : 0;
                                tienGiamGia = (item.Gia_Ban * item.SoLuong * phanTramGiamGia) / 100;
                            }
                            if (tienGiamGia > 0)
                            {
                                content = string.Format(@"Giảm giá {0}% ({1}đ)", phanTramGiamGia, (tienGiamGia).ToString("N0"));
                            }
                        }
                    }
                }

                return (content, tienGiamGia, phanTramGiamGia);
            }
            #endregion

            #region KHUYEN MAI
            private async Task<ChietKhauItem> ConvertKMtoCK(M_KhuyenMai km, decimal totalAmount, M_KhachHang khachHang, IEnumerable<int> Ma_KM_DT, DateTime dateCreatedBill)
            {
                ChietKhauItem chietKhau = new ChietKhauItem();
                if (km != null)
                {
                    decimal khuyenMaiHD = 0;
                    // giảm giá 10k cho hóa đơn 20k
                    // giảm giá tối đa 10k cho hóa đơn 
                    if ((km.MinHoaDon > 0 && totalAmount >= km.MinHoaDon) || km.MinHoaDon == 0)
                    {
                        if (km.DoiTuongTatCa == 1 || 
                            (km.DoiTuongNhomKhachHang == 1 && Ma_KM_DT.Contains(khachHang.Ma_NKH.Value)) || 
                            (km.DoiTuongTheThanhVien == 1 && khachHang.Ma_TTV != null && Ma_KM_DT.Contains(khachHang.Ma_TTV.Value)))
                        {
                            bool isValid = await IsHourValid(km, dateCreatedBill.RemoveSecond());
                            if (isValid) 
                            {
                                IsApplyKhuyenMai = true;
                                // Khuyến mãi theo số tiền
                                if (km.LoaiKhuyenMai == (int)GIA_TRI_CHIET_KHAU.SO_TIEN)
                                {
                                    khuyenMaiHD = km.GiaTriKhuyenMai;
                                    if (km.MaxKhuyenMai > 0)
                                    {
                                        if (km.GiaTriKhuyenMai > km.MaxKhuyenMai)
                                        {
                                            khuyenMaiHD = km.MaxKhuyenMai;
                                        }
                                    }
                                    chietKhau.LoaiCk = km.LoaiKhuyenMai;
                                    chietKhau.ValueCk = khuyenMaiHD;
                                    ContentKhuyenMai = string.Format(@"Áp dụng khuyến mãi: {0}đ", khuyenMaiHD.ToString("N0"));
                                }

                                // khuyến mãi theo phần trăm
                                if (km.LoaiKhuyenMai == (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM)
                                {
                                    khuyenMaiHD = (totalAmount * km.GiaTriKhuyenMai) / 100;
                                    // tính khuyến mãi tối đa
                                    if (km.MaxKhuyenMai > 0)
                                    {
                                        if (khuyenMaiHD > km.MaxKhuyenMai)
                                        {
                                            chietKhau.MaxValue = km.MaxKhuyenMai;
                                            ContentKhuyenMai = string.Format(@"Áp dụng khuyến mãi: {0}%", chietKhau.MaxValue);
                                        }
                                        chietKhau.LoaiCk = km.LoaiKhuyenMai;
                                        chietKhau.ValueCk = km.GiaTriKhuyenMai;
                                        ContentKhuyenMai = string.Format(@"Áp dụng khuyến mãi: {0}%", km.GiaTriKhuyenMai);
                                    }
                                    else
                                    {
                                        chietKhau.MaxValue = khuyenMaiHD;
                                        chietKhau.LoaiCk = km.LoaiKhuyenMai;
                                        chietKhau.ValueCk = km.GiaTriKhuyenMai;
                                        ContentKhuyenMai = string.Format(@"Áp dụng khuyến mãi {0}%", khuyenMaiHD);
                                    }
                                }
                            }
                        }
                    }
                }
                return chietKhau;
            }

            public async Task<M_KhuyenMai> LoadKhuyenMai(AddDonHangRequest request, DateTime dateCreatedBill)
            {
                if (request.MaKhuyenMai > 0)
                {
                    Expression<Func<M_KhuyenMai, bool>> getKM = x => x.MaKhuyenMai == request.MaKhuyenMai && x.DonVi == request.DonVi && x.Deleted == 0;
                    var km = await _khuyenMaiRepository.GetFirstOrDefaultAsync(getKM);

                    if (km != null)
                    {
                        // Check ngày khuyến mãi hết hạn hay chưa
                        if (dateCreatedBill != null)
                        {
                            if (dateCreatedBill > km.KhuyenMaiTuNgay && dateCreatedBill < km.KhuyenMaiDenNgay)
                            {
                                // Check áp dụng các thứ trong tuần
                                var dayOfWeek = DateTime.Now.DayOfWeek;
                                if (IsKhuyenMaiDayOfWeek(km, dateCreatedBill))
                                {
                                    return km;
                                }
                            }
                        }
                    }
                }
                return null;
            }

            private async Task<bool> IsHourValid(M_KhuyenMai km, DateTime dateCreate)
            {
                bool result = true;
                if (km.ApDungTheoKhungGio == 1)
                {
                    result = false;
                    var hours = dateCreate.Hour;
                    var minus = dateCreate.Minute;

                    Expression<Func<M_KhuyenMai_KhoangThoiGian, bool>> getkmthoigian = x => x.DonVi == km.DonVi && x.SoKhuyenMai == km.SoKhuyenMai && x.Deleted == 0;
                    var kmTGs = await _khuyenMaiKTGRepository.GetAsync(getkmthoigian, null);

                    // check khoản thời gian
                    foreach (var item in kmTGs)
                    {
                        var timeStart = item.ThoiGianBatDau.Split(':').ToList();
                        DateTime dateStart = new DateTime(2009, 8, 1, int.Parse(timeStart[0]), int.Parse(timeStart[1]), 0);
                        
                        var timeEnd = item.ThoiGianKetThuc.Split(':').ToList();
                        DateTime dateEnd = new DateTime(2009, 8, 1, int.Parse(timeEnd[0]), int.Parse(timeEnd[1]), 0);

                        dateCreate = new DateTime(2009, 8, 1, hours, minus, 0);
                        if (dateCreate >= dateStart && dateCreate <= dateEnd)
                        {
                            result = true;
                            break;
                        }   
                    }
                }

                return result;
            }
            private bool IsKhuyenMaiDayOfWeek(M_KhuyenMai khuyenMai, DateTime dateCreated)
            {
                bool result = false;
                
                if (khuyenMai.ApDungThuTrongTuan == 1)
                {
                    result = true;
                } 
                else
                {
                    var dayOfWeek = dateCreated.DayOfWeek;
                    switch (dayOfWeek)
                    {
                        case DayOfWeek.Sunday:
                            result = Convert.ToBoolean(khuyenMai.ChuNhat);
                            break;
                        case DayOfWeek.Monday:
                            result = Convert.ToBoolean(khuyenMai.ThuHai);
                            break;
                        case DayOfWeek.Tuesday:
                            result = Convert.ToBoolean(khuyenMai.ThuBa);
                            break;
                        case DayOfWeek.Wednesday:
                            result = Convert.ToBoolean(khuyenMai.ThuTu);
                            break;
                        case DayOfWeek.Thursday:
                            result = Convert.ToBoolean(khuyenMai.ThuNam);
                            break;
                        case DayOfWeek.Friday:
                            result = Convert.ToBoolean(khuyenMai.ThuSau);
                            break;
                        case DayOfWeek.Saturday:
                            result = Convert.ToBoolean(khuyenMai.ThuBay);
                            break;
                        default:
                            result = false;
                            break;
                    }
                }
                return result;
            }
            #endregion KHUYEN MAI
        }
    }
}
