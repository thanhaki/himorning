using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.KhuyenMai.Commands
{
    public class UpdateKhuyenMaiByIdCommand
    {
        public class UpdateKhuyenMaiRequest : IRequest <int>
        {
            public int SoKhuyenMai { get; set; }
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
            public class KhungGioUpdate
            {
                public int ID { get; set; }
                public string? ThoiGianBatDau { get; set; }
                public string? ThoiGianKetThuc { get; set; }
            }
            public List<KhungGioUpdate> ListTime { get; set; }
        }
        public class Handler : IRequestHandler<UpdateKhuyenMaiRequest, int>
        {
            private readonly IKhuyenMaiRepository _khuyenMaiRepository;
            private readonly IKhuyenMaiApDungRepository _khuyenMaiADRepository;
            private readonly IKhuyenMaiDoiTuongRepository _khuyenMaiDTRepository;
            private readonly IKhuyenMaiKTGRepository _khuyenMaiTGRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateKhuyenMaiByIdCommand> _logger;
            public Handler(IKhuyenMaiRepository khuyenMaiRepository, IKhuyenMaiApDungRepository khuyenMaiADRepository,
                    IKhuyenMaiDoiTuongRepository khuyenMaiDTRepository, IKhuyenMaiKTGRepository khuyenMaiTGRepository, IMapper mapper, ILogger<UpdateKhuyenMaiByIdCommand> logger)
            {
                _khuyenMaiRepository = khuyenMaiRepository ?? throw new ArgumentNullException(nameof(khuyenMaiRepository));
                _khuyenMaiADRepository = khuyenMaiADRepository ?? throw new ArgumentNullException(nameof(khuyenMaiADRepository));
                _khuyenMaiDTRepository = khuyenMaiDTRepository ?? throw new ArgumentNullException(nameof(khuyenMaiDTRepository));
                _khuyenMaiTGRepository = khuyenMaiTGRepository ?? throw new ArgumentNullException(nameof(khuyenMaiTGRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<int> Handle(UpdateKhuyenMaiRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _khuyenMaiRepository.BeginTransactionAsync();
                    Expression<Func<M_KhuyenMai, bool>> getKMbyID = x => x.SoKhuyenMai == request.SoKhuyenMai && x.DonVi == request.DonVi && x.Deleted == 0;
                    var getKmbyId = await _khuyenMaiRepository.GetFirstOrDefaultAsync(getKMbyID);

                    if (getKmbyId != null)
                    {
                        _mapper.Map(request, getKmbyId);

                        if (request.ApDungHoaDon == 0)
                        {
                            getKmbyId.ApDungHoaDon = 1;
                            getKmbyId.ApDungDanhMuc = getKmbyId.ApDungMatHang = 0;
                        }
                        if (request.ApDungHoaDon == 1)
                        {
                            getKmbyId.ApDungHoaDon = getKmbyId.ApDungMatHang = 0;
                            getKmbyId.ApDungDanhMuc = 1;
                        }
                        if (request.ApDungHoaDon == 2)
                        {
                            getKmbyId.ApDungHoaDon = getKmbyId.ApDungDanhMuc = 0;
                            getKmbyId.ApDungMatHang = 1;
                        }
                        getKmbyId.KhuyenMaiTuNgay = Convert.ToDateTime(request.KhuyenMaiTuNgay);
                        getKmbyId.KhuyenMaiDenNgay = Convert.ToDateTime(request.KhuyenMaiDenNgay);

                        //insert M_KhuyenMai_ApDung 
                        if (request.ApDungHoaDon == 1 || request.ApDungHoaDon == 2)//ap dụng cho danh mục thì insert
                        {
                            if (request.IdListApDung.Length > 0)
                            {
                                Expression<Func<M_KhuyenMai_ApDung, bool>> getByidAd = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.SoKhuyenMai == request.SoKhuyenMai;
                                var listKmAd = await _khuyenMaiADRepository.GetAsync(getByidAd, null);
                                await _khuyenMaiADRepository.DeleteRangeAsync(listKmAd.ToList());

                                List<M_KhuyenMai_ApDung> lst = new List<M_KhuyenMai_ApDung>();
                                Func<IQueryable<M_KhuyenMai_ApDung>, IOrderedQueryable<M_KhuyenMai_ApDung>> orderingKm = x => x.OrderByDescending(X => X.SoKhuyenMaiApDung);
                                var maxId = await _khuyenMaiADRepository.GetMaxIdAsync(orderingKm);

                                for (int i = 0; i < request.IdListApDung.Length; i++)
                                {
                                    M_KhuyenMai_ApDung ad = new M_KhuyenMai_ApDung();
                                    ad.SoKhuyenMaiApDung = (maxId == null ? 0 :maxId.SoKhuyenMaiApDung) + i + 1;
                                    ad.SoKhuyenMai = getKmbyId.SoKhuyenMai;
                                    ad.MaApDung = request.IdListApDung[i];
                                    ad.DonVi = getKmbyId.DonVi;
                                    lst.Add(ad);
                                }
                                await _khuyenMaiADRepository.AddRangeAsync(lst);
                            }
                        }

                        if (request.DoiTuongTatCa == 0)
                        {
                            getKmbyId.DoiTuongTatCa = 1;
                            getKmbyId.DoiTuongNhomKhachHang = getKmbyId.DoiTuongTheThanhVien = 0;
                        }
                        if (request.DoiTuongTatCa == 1)
                        {
                            getKmbyId.DoiTuongTatCa = getKmbyId.DoiTuongTheThanhVien = 0;
                            getKmbyId.DoiTuongNhomKhachHang = 1;
                        }
                        if (request.DoiTuongTatCa == 2)
                        {
                            getKmbyId.DoiTuongTatCa = getKmbyId.DoiTuongNhomKhachHang = 0;
                            getKmbyId.DoiTuongTheThanhVien = 1;
                        }

                        //insert M_KhuyenMai_DoiTuong
                        if (request.DoiTuongTatCa == 1 || request.DoiTuongTatCa == 2)//check nhóm khách hàng insert M_KhuyenMai_DoiTuong
                        {
                            if (request.IdListDT.Length > 0)
                            {
                                Expression<Func<M_KhuyenMai_DoiTuong, bool>> getByidDt = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.SoKhuyenMai == request.SoKhuyenMai;
                                var listKmDt = await _khuyenMaiDTRepository.GetAsync(getByidDt, null);
                                await _khuyenMaiDTRepository.DeleteRangeAsync(listKmDt.ToList());

                                List<M_KhuyenMai_DoiTuong> lst = new List<M_KhuyenMai_DoiTuong>();
                                Func<IQueryable<M_KhuyenMai_DoiTuong>, IOrderedQueryable<M_KhuyenMai_DoiTuong>> orderingKm = x => x.OrderByDescending(X => X.SoKhuyenMaiDoiTuong);
                                var maxId = await _khuyenMaiDTRepository.GetMaxIdAsync(orderingKm);

                                for (int i = 0; i < request.IdListDT.Length; i++)
                                {
                                    M_KhuyenMai_DoiTuong ad = new M_KhuyenMai_DoiTuong();
                                    ad.SoKhuyenMaiDoiTuong =  (maxId == null ? 0 : maxId.SoKhuyenMaiDoiTuong) + i + 1;
                                    ad.SoKhuyenMai = getKmbyId.SoKhuyenMai;
                                    ad.MaDoiTuong = request.IdListDT[i];
                                    ad.DonVi = getKmbyId.DonVi;
                                    lst.Add(ad);
                                }
                                await _khuyenMaiDTRepository.AddRangeAsync(lst);
                            }
                        }

                        //insert M_KhuyenMai_KhoangThoiGian
                        if (request.ApDungTheoKhungGio == 1)//check vào khung giờ thì insert M_KhuyenMai_KhoangThoiGian
                        {
                            Expression<Func<M_KhuyenMai_KhoangThoiGian, bool>> getByidTg = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.SoKhuyenMai == request.SoKhuyenMai;
                            var listKmTg = await _khuyenMaiTGRepository.GetAsync(getByidTg, null);
                            await _khuyenMaiTGRepository.DeleteRangeAsync(listKmTg.ToList());
                            if (request.ListTime.Count > 0)
                            {
                                List<M_KhuyenMai_KhoangThoiGian> lst = new List<M_KhuyenMai_KhoangThoiGian>();

                                foreach (var item in request.ListTime)
                                {
                                    Func<IQueryable<M_KhuyenMai_KhoangThoiGian>, IOrderedQueryable<M_KhuyenMai_KhoangThoiGian>> orderingKmTg = x => x.OrderByDescending(X => X.SoKhuyenMaiKhoangThoiGian);
                                    var maxIdTg = await _khuyenMaiTGRepository.GetMaxIdAsync(orderingKmTg);
                                    M_KhuyenMai_KhoangThoiGian ad = new M_KhuyenMai_KhoangThoiGian();

                                    ad.SoKhuyenMaiKhoangThoiGian = maxIdTg == null ? 1 : maxIdTg.SoKhuyenMaiKhoangThoiGian + 1;
                                    ad.SoKhuyenMai = getKmbyId.SoKhuyenMai;
                                    ad.ThoiGianBatDau = item.ThoiGianBatDau;
                                    ad.ThoiGianKetThuc = item.ThoiGianKetThuc;
                                    ad.DonVi = getKmbyId.DonVi;
                                    lst.Add(ad);
                                    await _khuyenMaiTGRepository.AddRangeAsync(lst);
                                    lst.Clear();
                                }
                            }
                        }

                        await _khuyenMaiRepository.UpdateAsync(getKmbyId);
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
