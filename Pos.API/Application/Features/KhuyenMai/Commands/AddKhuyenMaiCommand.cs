using AutoMapper;
using MediatR; 
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Serilog.Filters;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography.Xml;

namespace Pos.API.Application.Features.KhuyenMai.Commands
{
    public class AddKhuyenMaiCommand
    {
        public class AddKhuyenMaiRequest : IRequest<int>
        {
            public string TenKhuyenMai { get; set; }
            public int LoaiKhuyenMai { get; set; }
            public decimal GiaTriKhuyenMai { get; set; }
            public decimal MinHoaDon { get; set; }
            public decimal MaxKhuyenMai { get; set; }
            public string? KhuyenMaiTuNgay { get; set; }
            public string? KhuyenMaiDenNgay { get; set; }
            public int ApDungThuTrongTuan { get; set; }
            public int ThuHai { get; set; }
            public int ThuBa { get; set; }
            public int ThuTu { get; set; }
            public int ThuNam { get; set; }
            public int ThuSau { get; set; }
            public int ThuBay { get; set; }
            public int ChuNhat { get; set; }
            public int ApDungHoaDon { get; set; }
            public int DoiTuongTatCa { get; set; }
            public int ApDungTheoKhungGio { get; set; }
            public string MieuTaKhuyenMai { get; set; }
            public int DonVi { get; set; }
            public int[] IdListApDung { get; set; }
            public int[] IdListDT { get; set; }
            public class KhungGio
            {
                public int ID { get; set; }
                public string? ThoiGianBatDau { get; set; }
                public string? ThoiGianKetThuc { get; set; }
            }
            public List<KhungGio> ListTime { get; set; }
        }
        public class Handler : IRequestHandler<AddKhuyenMaiRequest, int>
        {
            private readonly IKhuyenMaiRepository _khuyenMaiRepository;
            private readonly IKhuyenMaiApDungRepository _khuyenMaiADRepository;
            private readonly IKhuyenMaiDoiTuongRepository _khuyenMaiDTRepository;
            private readonly IKhuyenMaiKTGRepository _khuyenMaiTGRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddKhuyenMaiCommand> _logger;
            public Handler(IKhuyenMaiRepository khuyenMaiRepository, IKhuyenMaiApDungRepository khuyenMaiADRepository, IDonViRepository donViRepository, 
                    IKhuyenMaiDoiTuongRepository khuyenMaiDTRepository, IKhuyenMaiKTGRepository khuyenMaiTGRepository, IMapper mapper, ILogger<AddKhuyenMaiCommand> logger)
            {
                _khuyenMaiRepository = khuyenMaiRepository ?? throw new ArgumentNullException(nameof(khuyenMaiRepository));
                _khuyenMaiADRepository = khuyenMaiADRepository ?? throw new ArgumentNullException(nameof(khuyenMaiADRepository));
                _khuyenMaiDTRepository = khuyenMaiDTRepository ?? throw new ArgumentNullException(nameof(khuyenMaiDTRepository));
                _khuyenMaiTGRepository = khuyenMaiTGRepository ?? throw new ArgumentNullException(nameof(khuyenMaiTGRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }
            public async Task<int> Handle(AddKhuyenMaiRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _khuyenMaiRepository.BeginTransactionAsync();
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        _khuyenMaiRepository.CommitTransactionAsync();
                        return 0;
                    }
                    var khuyenMai = _mapper.Map<M_KhuyenMai>(request);
                    if (khuyenMai != null)
                    {

                        Func<IQueryable<M_KhuyenMai>, IOrderedQueryable<M_KhuyenMai>> orderingFunc = x => x.OrderByDescending(X => X.SoKhuyenMai);
                        Expression<Func<M_KhuyenMai, bool>> fillter = u => u.TenKhuyenMai.ToLower() == request.TenKhuyenMai.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var check = await _khuyenMaiRepository.GetFirstOrDefaultAsync(fillter);
                        var maxId = await _khuyenMaiRepository.GetMaxIdAsync(orderingFunc);
                        if (check != null)
                        {
                            _khuyenMaiRepository.CommitTransactionAsync();
                            return -1;
                        }
                        khuyenMai.SoKhuyenMai = maxId == null ? 1 : maxId.SoKhuyenMai + 1;
                        khuyenMai.MaKhuyenMai = maxId == null ? 1 : maxId.SoKhuyenMai + 1;
                        khuyenMai.DonVi = request.DonVi;
                        if (request.ApDungHoaDon == 0)
                        {
                            khuyenMai.ApDungHoaDon = 1;
                            khuyenMai.ApDungDanhMuc = khuyenMai.ApDungMatHang = 0;
                        }
                        if (request.ApDungHoaDon == 1)
                        {
                            khuyenMai.ApDungHoaDon = khuyenMai.ApDungMatHang = 0;
                            khuyenMai.ApDungDanhMuc = 1;
                        }
                        if (request.ApDungHoaDon == 2)
                        {
                            khuyenMai.ApDungHoaDon = khuyenMai.ApDungDanhMuc = 0;
                            khuyenMai.ApDungMatHang = 1;
                        }
                        khuyenMai.KhuyenMaiTuNgay = Convert.ToDateTime(request.KhuyenMaiTuNgay);
                        khuyenMai.KhuyenMaiDenNgay = Convert.ToDateTime(request.KhuyenMaiDenNgay);

                        //insert M_KhuyenMai_ApDung 
                        if (request.IdListApDung.Length > 0)
                        {
                            Func<IQueryable<M_KhuyenMai_ApDung>, IOrderedQueryable<M_KhuyenMai_ApDung>> orderingKmAd = x => x.OrderByDescending(X => X.SoKhuyenMaiApDung);
                            var maxIdAd = await _khuyenMaiADRepository.GetMaxIdAsync(orderingKmAd);

                            List<M_KhuyenMai_ApDung> lst = new List<M_KhuyenMai_ApDung>();
                            for (int i = 0; i < request.IdListApDung.Length; i++)
                            {
                                M_KhuyenMai_ApDung ad = new M_KhuyenMai_ApDung();
                                ad.SoKhuyenMaiApDung = (maxIdAd == null ? 0 : maxIdAd.SoKhuyenMaiApDung) + i + 1;
                                ad.SoKhuyenMai = khuyenMai.SoKhuyenMai;
                                ad.MaApDung = request.IdListApDung[i];
                                ad.DonVi = khuyenMai.DonVi;
                                lst.Add(ad);
                            }
                            await _khuyenMaiADRepository.AddRangeAsync(lst);

                        }

                        if (request.DoiTuongTatCa == 0)
                        {
                            khuyenMai.DoiTuongTatCa = 1;
                            khuyenMai.DoiTuongNhomKhachHang = khuyenMai.DoiTuongTheThanhVien = 0;
                        }
                        if (request.DoiTuongTatCa == 1)
                        {
                            khuyenMai.DoiTuongTatCa = khuyenMai.DoiTuongTheThanhVien = 0;
                            khuyenMai.DoiTuongNhomKhachHang = 1;
                        }
                        if (request.DoiTuongTatCa == 2)
                        {
                            khuyenMai.DoiTuongTatCa = khuyenMai.DoiTuongNhomKhachHang = 0;
                            khuyenMai.DoiTuongTheThanhVien = 1;
                        }
                        //insert M_KhuyenMai_DoiTuong
                        if (request.IdListDT.Length > 0)
                        {
                            List<M_KhuyenMai_DoiTuong> lst = new List<M_KhuyenMai_DoiTuong>();
                            Func<IQueryable<M_KhuyenMai_DoiTuong>, IOrderedQueryable<M_KhuyenMai_DoiTuong>> orderingKm = x => x.OrderByDescending(X => X.SoKhuyenMaiDoiTuong);
                            var maxIdDt = await _khuyenMaiDTRepository.GetMaxIdAsync(orderingKm);

                            for (int i = 0; i < request.IdListDT.Length; i++)
                            {
                                M_KhuyenMai_DoiTuong ad = new M_KhuyenMai_DoiTuong();
                                ad.SoKhuyenMaiDoiTuong = (maxIdDt == null ? 0 : maxIdDt.SoKhuyenMaiDoiTuong) + i + 1;
                                ad.SoKhuyenMai = khuyenMai.SoKhuyenMai;
                                ad.MaDoiTuong = request.IdListDT[i];
                                ad.DonVi = khuyenMai.DonVi;
                                lst.Add(ad);
                            }
                            await _khuyenMaiDTRepository.AddRangeAsync(lst);
                        }

                        //insert M_KhuyenMai_KhoangThoiGian
                        if (request.ApDungTheoKhungGio == 1)//check vào khung giờ thì insert M_KhuyenMai_KhoangThoiGian
                        {
                            if (request.ListTime.Count > 0)
                            {
                                List<M_KhuyenMai_KhoangThoiGian> lst = new List<M_KhuyenMai_KhoangThoiGian>();

                                foreach (var item in request.ListTime)
                                {
                                    Func<IQueryable<M_KhuyenMai_KhoangThoiGian>, IOrderedQueryable<M_KhuyenMai_KhoangThoiGian>> orderingKmTg = x => x.OrderByDescending(X => X.SoKhuyenMaiKhoangThoiGian);
                                    var maxIdTg = await _khuyenMaiTGRepository.GetMaxIdAsync(orderingKmTg);
                                    M_KhuyenMai_KhoangThoiGian ad = new M_KhuyenMai_KhoangThoiGian();

                                    ad.SoKhuyenMaiKhoangThoiGian = maxIdTg == null ? 1 : maxIdTg.SoKhuyenMaiKhoangThoiGian + 1;
                                    ad.SoKhuyenMai = khuyenMai.SoKhuyenMai;
                                    ad.ThoiGianBatDau = item.ThoiGianBatDau;
                                    ad.ThoiGianKetThuc = item.ThoiGianKetThuc;
                                    ad.DonVi = khuyenMai.DonVi;
                                    lst.Add(ad);
                                    await _khuyenMaiTGRepository.AddRangeAsync(lst);
                                    lst.Clear();
                                }
                            }
                        }

                        await _khuyenMaiRepository.AddAsync(khuyenMai);
                        _logger.LogInformation($"Khuyen mai {Unit.Value} is successfully created.");
                    }
                    _khuyenMaiRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _khuyenMaiRepository.RollbackTransactionAsync();
                    return -1;
                    throw;
                }

            }
        }
    }
}
