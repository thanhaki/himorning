using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;
using Pos.API.Models;
using Org.BouncyCastle.Asn1.Cmp;
using Pos.API.Infrastructure.Repositories;

namespace Pos.API.Application.Features.PostBill.Commands
{
    public class DeleteBillCommand : IRequest<int>
    {
        public class DeleteDHRequest : IRequest<int>
        {
            public int? DonVi { set; get; }
            public string[] MaDonHang { set; get; }
            public string? LyDoHuy { set; get; }
        }

        public class Handler : IRequestHandler<DeleteDHRequest, int>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IDonHangChiTietRepository _donHangChiTietRepository;
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly ILichSuTichDiemKHRepository _lichSuTichDiemKHRepository;
            private readonly IMapper _mapper;
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly ILichSuDonHangRepository _lichSuDonHangRepository;
            private readonly IMatHangRepository _matHangRepository;

            public Handler(
                IMapper mapper,
                IDonHangRepository donHangRepository,
                IKhachHangRepository khachHangRepository,
                ILichSuTichDiemKHRepository lichSuTichDiemKHRepository,
                ITheThanhVienRepository theThanhVienRepository,
                IDonHangChiTietRepository donHangChiTietRepository,
                ILichSuDonHangRepository lichSuDonHangRepository,
                IMatHangRepository matHangRepository)
            {
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _lichSuTichDiemKHRepository = lichSuTichDiemKHRepository ?? throw new ArgumentNullException(nameof(lichSuTichDiemKHRepository));
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _donHangChiTietRepository = donHangChiTietRepository;
                _lichSuDonHangRepository = lichSuDonHangRepository;
                _matHangRepository = matHangRepository;
            }

            public async Task<int> Handle(DeleteDHRequest request, CancellationToken cancellationToken)
            {
                if (request.MaDonHang.Length > 0)
                {
                    Expression<Func<T_DonHang, bool>> filterDH = x => x.DonVi == request.DonVi && request.MaDonHang.Contains(x.MaDonHang);
                    var listDH = await _donHangRepository.GetAsync(filterDH, null);
                    try
                    {

                        if (listDH != null && listDH.Count > 0)
                        {
                            _donHangRepository.BeginTransactionAsync();
                            List<M_KhachHang> listKh = new List<M_KhachHang>();
                            List<T_LichSuTichDiem_KhachHang> listLSTD = new List<T_LichSuTichDiem_KhachHang>();
                            foreach (var item in listDH)
                            {
                                (M_KhachHang kh, T_LichSuTichDiem_KhachHang lstd) = await HandleUpdateDiemTichLuyKHAsync(item.Ma_KhachHang, item.DonVi, item);
                                if (kh != null)
                                {
                                    listKh.Add(kh);
                                    if (lstd != null)
                                    {
                                        listLSTD.Add(lstd);
                                    }
                                }
                                item.Deleted = 1;
                                item.TinhTrangDonHang = 3;
                                item.LyDoHuy = request.LyDoHuy;
                                var lstLSMH = await AddLichSuMatHang(item, request.DonVi.Value);
                                await _lichSuDonHangRepository.AddRangeAsync(lstLSMH);
                            }
                            await _donHangRepository.UpdateRangeAsync(listDH.ToList());
                            if (listKh.Count > 0)
                            {
                                await _khachHangRepository.UpdateRangeAsync(listKh);
                                if (listLSTD.Count > 0)
                                {
                                    await _lichSuTichDiemKHRepository.AddRangeAsync(listLSTD);
                                }
                            }
                            _donHangRepository.CommitTransactionAsync();
                        }
                    } catch(Exception ex)
                    {
                        _donHangRepository.RollbackTransactionAsync();
                    }
                }
                return 1;
            }

            private async Task<List<T_LichSu_MatHang>> AddLichSuMatHang(T_DonHang donHang, int dv)
            {
                List<T_LichSu_MatHang> lsDHList = new List<T_LichSu_MatHang>();

                Expression<Func<T_DonHangChiTiet, bool>> getctdh = x => x.DonVi == dv && x.Deleted == 0 && x.SoDonHang == donHang.SoDonHang;
                var listCtdh = await _donHangChiTietRepository.GetAsync(getctdh);
                if (listCtdh != null && listCtdh.Count > 0)
                {
                    Func<IQueryable<T_LichSu_MatHang>, IOrderedQueryable<T_LichSu_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.MaLichSu);
                    var maxMaLS = await _lichSuDonHangRepository.GetMaxIdAsync(orderingFunc);
                    int nextMaLS = maxMaLS == null ? 1 : maxMaLS.MaLichSu + 1;

                    foreach (var item in listCtdh)
                    {
                        Expression<Func<M_MatHang, bool>> getMH = x => x.Ma_MH == item.Ma_MH && x.Deleted == 0 && x.DonVi == dv;
                        var matHang = await _matHangRepository.GetFirstOrDefaultAsync(getMH);
                        if (matHang != null)
                        {
                            T_LichSu_MatHang t_LichSu_MatHang = new T_LichSu_MatHang();
                            t_LichSu_MatHang.MaLichSu = nextMaLS;
                            t_LichSu_MatHang.Ten_MH = item.Ten_MH;
                            t_LichSu_MatHang.Ma_MH = item.Ma_MH;
                            t_LichSu_MatHang.SoLuongThayDoi = -(item.SoLuong_MH);

                            t_LichSu_MatHang.LoaiPhieu_ThamChieu = 8;
                            t_LichSu_MatHang.NoiDung_LichSu = "Hủy xuất bán";
                            t_LichSu_MatHang.Ma_ThamChieu = donHang.MaDonHang;

                            int soLuongConLaiMH = await _lichSuDonHangRepository.GetSoLuongConLaiMH(item.DonVi, item.Ma_MH);
                            t_LichSu_MatHang.SoLuongConLai = soLuongConLaiMH + item.SoLuong_MH;

                            t_LichSu_MatHang.DonVi = (int)dv;

                            t_LichSu_MatHang.NgayLichSu = Utilities.GetDateTimeSystem();
                            lsDHList.Add(t_LichSu_MatHang);

                            nextMaLS++;
                        }
                    }
                }
                return lsDHList;
            }

            async Task<(M_KhachHang, T_LichSuTichDiem_KhachHang)> HandleUpdateDiemTichLuyKHAsync(int maKH, int dv, T_DonHang donHang)
            {

                Expression<Func<M_KhachHang, bool>> getKH = x => x.DonVi == dv && x.Ma_KH == maKH && x.Deleted == 0;
                var khachHang = await _khachHangRepository.GetFirstOrDefaultAsync(getKH);
                if (khachHang != null)
                {
                    //Expression<Func<M_TheThanhVien, bool>> getTTV = x => x.DonVi == dv && x.Deleted == 0 && x.Ma_TTV == khachHang.Ma_TTV;
                    //var ttvHienTai = await _theThanhVienRepository.GetFirstOrDefaultAsync(getTTV);
                    
                    Expression<Func<T_LichSuTichDiem_KhachHang, bool>> getlsdh = x => x.DonVi == dv && x.Deleted == 0 && x.SoDonHang == donHang.SoDonHang;
                    var lsdhbyMaDH = await _lichSuTichDiemKHRepository.GetFirstOrDefaultAsync(getlsdh);
                    if (lsdhbyMaDH != null)
                    {
                        T_LichSuTichDiem_KhachHang lstd = new T_LichSuTichDiem_KhachHang();
                        lstd.MaLichSuTichDiem = Guid.NewGuid();
                        lstd.SoDonHang = donHang.SoDonHang;
                        lstd.DonVi = donHang.DonVi;
                        lstd.Ma_KH = donHang.Ma_KhachHang;

                        lstd.DiemTichLuyCu = khachHang.DiemTichLuy == null ? 0 : (int)khachHang.DiemTichLuy;
                        lstd.DiemTichLuyThem = -Convert.ToInt32(lsdhbyMaDH.DiemTichLuyThem);
                        lstd.DiemTichLuyMoi = lstd.DiemTichLuyCu + lstd.DiemTichLuyThem;
                        lstd.NoiDungTichLuy = string.Format("Hủy hóa đơn số {0}", donHang.MaDonHang);
                        khachHang.DiemTichLuy = lstd.DiemTichLuyMoi;
                        return (khachHang, lstd);
                    }
                }
                return (null, null);
            }
        }
    }
}
