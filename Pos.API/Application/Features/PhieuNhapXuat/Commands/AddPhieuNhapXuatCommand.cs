using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.VisualBasic;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PhieuNhapXuat.Commands
{
    public class AddPhieuNhapXuatCommand
    {
        public class PhieuNXRequest : IRequest<int>
        {
            public int Ma_PNX { get; set; }
            public int Loai_Phieu { get; set; }
            public string Ma_Phieu { get; set; }
            public string Nhom_Phieu { get; set; }
            public int TinhTrang_Phieu { get; set; }
            public string Ten_Phieu { get; set; }
            public string TenLoaiPhieu { get; set; }
            public DateTime? NgayLap_Phieu { get; set; }
            public string NgayDeXuat { get; set; }
            public string NguoiDeXuat { get; set; }
            public string GhiChu { get; set; }
            public string? MieuTaFile { get; set; }
            public int IsDathangNk { get; set; }
            public class MatHang
            {
                public int Ma_MH { get; set; }
                public string Ten_MH { get; set; }
                public int SoLuong { get; set; }
                public int? soLuongKiemKe { get; set; }
                public int? SoLuongChenhLech { get; set; }
                public string? LyDoDieuChinh { get; set; }
            }
            public List<MatHang> ListMatHang { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<PhieuNXRequest, int>
        {
            private readonly IPhieuNhapXuatRepository _phieuXuatNhapRepository;
            private readonly ILichSuDonHangRepository _lichSuDonHangRepository;
            private readonly IPhieuNhapXuatCTRepository _chiTietPNXRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddPhieuNhapXuatCommand> _logger;
            public Handler(IPhieuNhapXuatRepository phieuXuatNhapRepository, ILichSuDonHangRepository lichSuDonHangRepository,
                IPhieuNhapXuatCTRepository chiTietPNXRepository, IDonViRepository donViRepository,
                IMapper mapper, ILogger<AddPhieuNhapXuatCommand> logger)
            {
                _phieuXuatNhapRepository = phieuXuatNhapRepository ?? throw new ArgumentNullException(nameof(phieuXuatNhapRepository));
                _lichSuDonHangRepository = lichSuDonHangRepository ?? throw new ArgumentNullException(nameof(lichSuDonHangRepository));
                _chiTietPNXRepository = chiTietPNXRepository ?? throw new ArgumentNullException(nameof(chiTietPNXRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(PhieuNXRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _phieuXuatNhapRepository.BeginTransactionAsync();
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        _phieuXuatNhapRepository.CommitTransactionAsync();
                        return 0;
                    }
                    var nhapXuat = _mapper.Map<T_PhieuNhapXuat>(request);
                    if (nhapXuat != null)
                    {
                        string prefix = string.Empty;
                        if (request.Nhom_Phieu == "NHAP")
                            prefix = "PN";
                        if (request.Nhom_Phieu == "XUAT")
                            prefix = "PX";
                        if (request.Nhom_Phieu == "KIEMKE")
                            prefix = "PK";
                        //trường hợp thêm mới phiếu => LoaiPhieu = 1 (đặt hàng) lưu (T_PhieuNhapXuat)
                        if (request.IsDathangNk == 1 && request.Ma_PNX == 0)
                        {
                            Func<IQueryable<T_PhieuNhapXuat>, IOrderedQueryable<T_PhieuNhapXuat>> orderingFunc = x => x.OrderByDescending(X => X.Ma_PNX);
                            var maxId = await _phieuXuatNhapRepository.GetMaxIdAsync(orderingFunc);

                            nhapXuat.Ma_PNX = maxId == null ? 1 : maxId.Ma_PNX + 1;

                            string maPhieu = Utilities.FormatCode(prefix, 10, "0");

                            Func<IQueryable<T_PhieuNhapXuat>, IOrderedQueryable<T_PhieuNhapXuat>> orderCodeNhapX = x => x.OrderByDescending(X => X.Ma_Phieu);
                            Expression<Func<T_PhieuNhapXuat, bool>> fillter_MP = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Loai_Phieu == request.Loai_Phieu;
                            var maxMaPhieuNX = await _phieuXuatNhapRepository.GetAsync(fillter_MP, orderCodeNhapX);
                            if (maxMaPhieuNX != null && maxMaPhieuNX.Count() > 0)
                            {
                                var first = maxMaPhieuNX.FirstOrDefault();
                                maPhieu = Utilities.FormatCode(prefix, 10, first.Ma_Phieu);
                            }
                            nhapXuat.Ma_Phieu = maPhieu;
                            //add T_PhieuNhapXuat_ChiTiet
                            if (request.ListMatHang.Count > 0)
                            {
                                List<T_PhieuNhapXuat_ChiTiet> lst = new List<T_PhieuNhapXuat_ChiTiet>();
                                foreach (var (item,index) in request.ListMatHang.Select((v, i) => (v, i)))
                                {
                                    T_PhieuNhapXuat_ChiTiet mh = new T_PhieuNhapXuat_ChiTiet();
                                    mh.Ma_PNX = nhapXuat.Ma_PNX;
                                    mh.Ma_Phieu = nhapXuat.Ma_Phieu;
                                    mh.Ma_MH = item.Ma_MH;
                                    mh.Ten_MH = item.Ten_MH;
                                    mh.SoLuong = item.SoLuong;
                                    mh.SoLuongBanDau = item.SoLuong;
                                    mh.SoLuongKiemKe = item.soLuongKiemKe;
                                    mh.SoLuongChenhLech = item.SoLuongChenhLech;
                                    mh.LyDoDieuChinh = item.LyDoDieuChinh;
                                    mh.Sort = index + 1;
                                    mh.DonVi = request.DonVi;
                                    lst.Add(mh); 
                                }
                                if (lst.Count > 0)
                                    await _chiTietPNXRepository.AddRangeAsync(lst);
                            }
                            nhapXuat.NgayDeXuat = Convert.ToDateTime(request.NgayDeXuat);
                            await _phieuXuatNhapRepository.AddAsync(nhapXuat);
                        }
                        
                        //trường hợp thêm phiếu đặt hàng và nhập kho thì add mới => LoaiPhieu = 2 lưu (T_PhieuNhapXuat,T_PhieuNhapXuat_ChiTiet)
                        if (request.IsDathangNk == 2 && request.Ma_PNX == 0)
                        {

                            Func<IQueryable<T_PhieuNhapXuat>, IOrderedQueryable<T_PhieuNhapXuat>> orderingFunc = x => x.OrderByDescending(X => X.Ma_PNX);
                            var maxId = await _phieuXuatNhapRepository.GetMaxIdAsync(orderingFunc);

                            nhapXuat.Ma_PNX = maxId == null ? 1 : maxId.Ma_PNX + 1;

                            string maPhieu = Utilities.FormatCode(prefix, 10, "0");

                            Func<IQueryable<T_PhieuNhapXuat>, IOrderedQueryable<T_PhieuNhapXuat>> orderCodeNhapX = x => x.OrderByDescending(X => X.Ma_Phieu);
                            Expression<Func<T_PhieuNhapXuat, bool>> fillter_MP = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Loai_Phieu == request.Loai_Phieu;
                            var maxMaPhieuNX = await _phieuXuatNhapRepository.GetAsync(fillter_MP, orderCodeNhapX);
                            if (maxMaPhieuNX != null && maxMaPhieuNX.Count() > 0)
                            {
                                var first = maxMaPhieuNX.FirstOrDefault();
                                maPhieu = Utilities.FormatCode(prefix, 10, first.Ma_Phieu);
                            }
                            nhapXuat.Ma_Phieu = maPhieu;
                            //add T_PhieuNhapXuat_ChiTiet
                            if (request.ListMatHang.Count > 0)
                            {
                                List<T_PhieuNhapXuat_ChiTiet> lst = new List<T_PhieuNhapXuat_ChiTiet>();

                                foreach (var (item, index) in request.ListMatHang.Select((v, i) => (v, i)))
                                {
                                    T_PhieuNhapXuat_ChiTiet mh = new T_PhieuNhapXuat_ChiTiet();
                                    mh.Ma_PNX = nhapXuat.Ma_PNX;
                                    mh.Ma_Phieu = nhapXuat.Ma_Phieu;
                                    mh.Ma_MH = item.Ma_MH;
                                    mh.Ten_MH = item.Ten_MH;
                                    mh.SoLuong = item.SoLuong;
                                    mh.SoLuongBanDau = item.SoLuong;
                                    mh.SoLuongKiemKe = item.soLuongKiemKe;
                                    mh.SoLuongChenhLech = item.SoLuongChenhLech;
                                    mh.LyDoDieuChinh = item.LyDoDieuChinh;
                                    mh.Sort = index + 1;
                                    mh.DonVi = request.DonVi;
                                    lst.Add(mh);
                                }
                                if (lst.Count > 0)
                                    await _chiTietPNXRepository.AddRangeAsync(lst);
                            }

                            //Add T_LichSu_MatHang
                            List<T_LichSu_MatHang> lsDHList = new List<T_LichSu_MatHang>();
                            Func<IQueryable<T_LichSu_MatHang>, IOrderedQueryable<T_LichSu_MatHang>> orderLs = x => x.OrderByDescending(X => X.MaLichSu);
                            var maxMaLS = await _lichSuDonHangRepository.GetMaxIdAsync(orderLs);
                            int nextMaLS = maxMaLS == null ? 1 : maxMaLS.MaLichSu + 1;
                            foreach (var item in request.ListMatHang)
                            {
                                T_LichSu_MatHang t_LichSu_MatHang = new T_LichSu_MatHang();
                                t_LichSu_MatHang.MaLichSu = nextMaLS;
                                t_LichSu_MatHang.Ten_MH = item.Ten_MH;
                                t_LichSu_MatHang.Ma_MH = item.Ma_MH;

                                t_LichSu_MatHang.LoaiPhieu_ThamChieu = nhapXuat.Loai_Phieu;
                                t_LichSu_MatHang.NoiDung_LichSu = request.TenLoaiPhieu;
                                t_LichSu_MatHang.Ma_ThamChieu = nhapXuat.Ma_Phieu.ToString();
                                int soLuongConLai = await _lichSuDonHangRepository.GetSoLuongConLaiMH(request.DonVi, item.Ma_MH);
                                if (request.Nhom_Phieu == "NHAP")
                                {
                                    t_LichSu_MatHang.SoLuongThayDoi = item.SoLuong;
                                    t_LichSu_MatHang.SoLuongConLai = soLuongConLai + item.SoLuong;
                                }
                                    
                                if (request.Nhom_Phieu == "XUAT")
                                {
                                    t_LichSu_MatHang.SoLuongThayDoi = item.SoLuong;
                                    t_LichSu_MatHang.SoLuongConLai = soLuongConLai - item.SoLuong;
                                }
                                    
                                if (request.Nhom_Phieu == "KIEMKE")
                                {
                                    t_LichSu_MatHang.SoLuongThayDoi = item.SoLuongChenhLech;
                                    t_LichSu_MatHang.SoLuongConLai = item.soLuongKiemKe;
                                }
                                    
                                t_LichSu_MatHang.DonVi = (int)request.DonVi;
                                t_LichSu_MatHang.NgayLichSu = Utilities.GetDateTimeSystem();
                                lsDHList.Add(t_LichSu_MatHang);

                                nextMaLS++;
                            }

                            await _lichSuDonHangRepository.AddRangeAsync(lsDHList);
                            await _phieuXuatNhapRepository.AddAsync(nhapXuat);
                        }
                        // đặt hàng => nhập kho  => update LoaiPhieu = 2 lưu (T_LichSu_MatHang)
                        if (request.IsDathangNk == 2 && request.Ma_PNX != 0)
                        {
                            Expression<Func<T_PhieuNhapXuat, bool>> getPhieuNx = x => x.Ma_PNX == request.Ma_PNX && x.DonVi == request.DonVi;
                            var getPhieuById = await _phieuXuatNhapRepository.GetFirstOrDefaultAsync(getPhieuNx);
                            if (getPhieuById == null)
                            {
                                _phieuXuatNhapRepository.CommitTransactionAsync();
                                return 1;
                            }    
                            getPhieuById.TinhTrang_Phieu = request.TinhTrang_Phieu;
                            //delet T_PhieuNhapXuatCT
                            Expression<Func<T_PhieuNhapXuat_ChiTiet, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.Ma_PNX == request.Ma_PNX;
                            var listCT = await _chiTietPNXRepository.GetAsync(getByid);
                            await _chiTietPNXRepository.DeleteRangeAsync(listCT.ToList());

                            //add T_PhieuNhapXuat_ChiTiet
                            if (request.ListMatHang.Count > 0)
                            {
                                List<T_PhieuNhapXuat_ChiTiet> lst = new List<T_PhieuNhapXuat_ChiTiet>();

                                foreach (var (item, index) in request.ListMatHang.Select((v, i) => (v, i)))
                                {
                                    T_PhieuNhapXuat_ChiTiet mh = new T_PhieuNhapXuat_ChiTiet();
                                    mh.Ma_PNX = getPhieuById.Ma_PNX;
                                    mh.Ma_Phieu = getPhieuById.Ma_Phieu;
                                    mh.Ma_MH = item.Ma_MH;
                                    mh.Ten_MH = item.Ten_MH;
                                    mh.SoLuong = item.SoLuong;
                                    mh.SoLuongBanDau = item.SoLuong;
                                    mh.SoLuongKiemKe = item.soLuongKiemKe;
                                    mh.SoLuongChenhLech = item.SoLuongChenhLech;
                                    mh.LyDoDieuChinh = item.LyDoDieuChinh;
                                    mh.Sort = index + 1;
                                    mh.DonVi = request.DonVi;
                                    lst.Add(mh);
                                }
                                if (lst.Count > 0)
                                    await _chiTietPNXRepository.AddRangeAsync(lst);
                            }


                            //Add T_LichSu_MatHang
                            List<T_LichSu_MatHang> lsDHList = new List<T_LichSu_MatHang>();
                            Func<IQueryable<T_LichSu_MatHang>, IOrderedQueryable<T_LichSu_MatHang>> orderLs = x => x.OrderByDescending(X => X.MaLichSu);
                            var maxMaLS = await _lichSuDonHangRepository.GetMaxIdAsync(orderLs);
                            int nextMaLS = maxMaLS == null ? 1 : maxMaLS.MaLichSu + 1;
                            foreach (var item in request.ListMatHang)
                            {
                                T_LichSu_MatHang t_LichSu_MatHang = new T_LichSu_MatHang();
                                t_LichSu_MatHang.MaLichSu = nextMaLS;
                                t_LichSu_MatHang.Ten_MH = item.Ten_MH;
                                t_LichSu_MatHang.Ma_MH = item.Ma_MH;

                                t_LichSu_MatHang.LoaiPhieu_ThamChieu = nhapXuat.Loai_Phieu;
                                t_LichSu_MatHang.NoiDung_LichSu = request.TenLoaiPhieu;
                                t_LichSu_MatHang.Ma_ThamChieu = nhapXuat.Ma_Phieu.ToString();
                                int soLuongConLai = await _lichSuDonHangRepository.GetSoLuongConLaiMH(request.DonVi, item.Ma_MH);
                                if (request.Nhom_Phieu == "NHAP")
                                {
                                    t_LichSu_MatHang.SoLuongThayDoi = item.SoLuong;
                                    t_LichSu_MatHang.SoLuongConLai = soLuongConLai + item.SoLuong;
                                }
                                if (request.Nhom_Phieu == "XUAT")
                                {
                                    t_LichSu_MatHang.SoLuongThayDoi = item.SoLuong;
                                    t_LichSu_MatHang.SoLuongConLai = soLuongConLai - item.SoLuong;
                                }
                                if (request.Nhom_Phieu == "KIEMKE")
                                {
                                    t_LichSu_MatHang.SoLuongThayDoi = item.SoLuongChenhLech;
                                    t_LichSu_MatHang.SoLuongConLai = item.soLuongKiemKe;
                                }
                                t_LichSu_MatHang.DonVi = (int)request.DonVi;
                                t_LichSu_MatHang.NgayLichSu = Utilities.GetDateTimeSystem();
                                lsDHList.Add(t_LichSu_MatHang);
                                nextMaLS++;
                            }

                            await _lichSuDonHangRepository.AddRangeAsync(lsDHList);
                            await _phieuXuatNhapRepository.UpdateAsync(getPhieuById);
                        }
                        else
                        {
                            //Phiếu chưa nhập Kho chỉnh sửa thông tin 
                            if (request.IsDathangNk == 1 && request.Ma_PNX != 0)
                            {
                                Expression<Func<T_PhieuNhapXuat, bool>> getPhieuNx = x => x.Ma_PNX == request.Ma_PNX && x.DonVi == request.DonVi;
                                var getPhieuById = await _phieuXuatNhapRepository.GetFirstOrDefaultAsync(getPhieuNx);

                                if (getPhieuById != null)
                                {
                                    _mapper.Map(request, getPhieuById);

                                    //add T_PhieuNhapXuat_ChiTiet
                                    if (request.ListMatHang.Count > 0)
                                    {
                                        //delet T_PhieuNhapXuatCT
                                        Expression<Func<T_PhieuNhapXuat_ChiTiet, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.Ma_PNX == request.Ma_PNX;
                                        var listCT = await _chiTietPNXRepository.GetAsync(getByid);
                                        await _chiTietPNXRepository.DeleteRangeAsync(listCT.ToList());

                                        List<T_PhieuNhapXuat_ChiTiet> lst = new List<T_PhieuNhapXuat_ChiTiet>();

                                        foreach (var (item, index) in request.ListMatHang.Select((v, i) => (v, i)))
                                        {
                                            T_PhieuNhapXuat_ChiTiet mh = new T_PhieuNhapXuat_ChiTiet();
                                            mh.Ma_PNX = nhapXuat.Ma_PNX;
                                            mh.Ma_Phieu = nhapXuat.Ma_Phieu;
                                            mh.Ma_MH = item.Ma_MH;
                                            mh.Ten_MH = item.Ten_MH;
                                            mh.SoLuong = item.SoLuong;
                                            mh.SoLuongBanDau = item.SoLuong;
                                            mh.SoLuongKiemKe = item.soLuongKiemKe;
                                            mh.SoLuongChenhLech = item.SoLuongChenhLech;
                                            mh.LyDoDieuChinh = item.LyDoDieuChinh;
                                            mh.Sort = index + 1;
                                            mh.DonVi = request.DonVi;
                                            lst.Add(mh);
                                        }
                                        if (lst.Count > 0)
                                            await _chiTietPNXRepository.AddRangeAsync(lst);
                                    }
                                    await _phieuXuatNhapRepository.UpdateAsync(getPhieuById);
                                }
                            }
                        }
                        _logger.LogInformation($"Phieu nhap xuat {Unit.Value} is successfully created.");
                    }
                    _phieuXuatNhapRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _phieuXuatNhapRepository.RollbackTransactionAsync();
                    return -1;
                    throw;
                }

            }
        }
    }
}
