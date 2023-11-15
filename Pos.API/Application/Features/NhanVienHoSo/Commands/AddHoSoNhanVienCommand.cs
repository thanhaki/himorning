using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhanVienHeSo.Commands
{
    public class AddHoSoNhanVienCommand
    {
        public class AddHoSoNVRequest : IRequest<int>
        {
            public string? CMND_NV { get; set; }
            public string? DiaChi_NV { get; set; }
            public string? DienThoai_NV { get; set; }
            public string? Email_NV { get; set; }
            public string? GhiChu { get; set; }
            public int GioiTinh { get; set; }
            public int? So_NV { get; set; }
            public string? Ma_NV { get; set; }
            public DateTime NgayCapCMND_NV { get; set; }
            public DateTime NgaySinh_NV { get; set; }
            public string? NoiCapCMND_NV { get; set; }
            public int? PhongBan { get; set; }
            public string? Ten_NV { get; set; }
            public int? TrinhDo_NV { get; set; }
            public int? Type_NV { get; set; }
            public int? TinhTrang { get; set; }
            public string? File_URL { get; set; }
            public int DonVi { get; set; }
            public class ListFileHoSo
            {
                public string? File_Name { get; set; }
                public string? File_URL { get; set; }
                public DateTime File_Start { get; set; }
                public DateTime File_End { get; set; }
                public DateTime File_Warning { get; set; }
            }
            public List<ListFileHoSo>? ListFile { get; set; }
        }
        public class Handler : IRequestHandler<AddHoSoNVRequest, int>
        {
            private readonly IMNhanVienRepository _mNhanVienRepository;
            private readonly INhanVienHoSoRepository _nhanVienHoSoRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddHoSoNhanVienCommand> _logger;
            public Handler(IMNhanVienRepository mNhanVienRepository,INhanVienHoSoRepository nhanVienHoSoRepository
                , IMapper mapper, ILogger<AddHoSoNhanVienCommand> logger, IDonViRepository donViRepository)
            {
                _mNhanVienRepository = mNhanVienRepository ?? throw new ArgumentNullException(nameof(mNhanVienRepository));
                _nhanVienHoSoRepository = nhanVienHoSoRepository ?? throw new ArgumentNullException(nameof(nhanVienHoSoRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }

            public async Task<int> Handle(AddHoSoNVRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        return 0;
                    }
                    _mNhanVienRepository.BeginTransactionAsync();
                    var nhanVienHS = _mapper.Map<M_NhanVien>(request);
                    if (nhanVienHS != null)
                    {
                        if (request.So_NV == 0 || request.So_NV == null)
                        {

                            Func<IQueryable<M_NhanVien>, IOrderedQueryable<M_NhanVien>> orderingFunc = x => x.OrderByDescending(X => X.So_NV);
                            var maxId = await _mNhanVienRepository.GetMaxIdAsync(orderingFunc);

                            nhanVienHS.So_NV = maxId == null ? 1 : maxId.So_NV + 1;
                            string maNhanVien = Utilities.FormatCode("HS", 10, "0");

                            var maxMaNV = await _mNhanVienRepository.GetAsync(u => u.Deleted == 0 && u.DonVi == request.DonVi, x => x.OrderByDescending(X => X.Ma_NV));
                            if (maxMaNV != null && maxMaNV.Count() > 0)
                            {
                                var first = maxMaNV.FirstOrDefault();
                                maNhanVien = Utilities.FormatCode("HS", 10, first.Ma_NV);
                            }
                            nhanVienHS.Ma_NV = maNhanVien;
                            nhanVienHS.NgayCapCMND_NV = Utilities.GetDateTimeSystem();
                            if ( request.ListFile?.Count > 0)
                            {
                                List<M_NhanVien_HoSo> lst = new List<M_NhanVien_HoSo>();
                                foreach (var item in request.ListFile)
                                {
                                    M_NhanVien_HoSo nv = new M_NhanVien_HoSo();
                                    nv.So_NV = nhanVienHS.So_NV;
                                    nv.File_Name = item.File_Name ?? "";
                                    nv.File_URL = item.File_URL ?? "";
                                    nv.File_Start = item.File_Start;
                                    nv.File_End = item.File_End;
                                    nv.File_Warning = item.File_Warning;
                                    nv.DonVi = request.DonVi;
                                    lst.Add(nv);
                                }
                                await _nhanVienHoSoRepository.AddRangeAsync(lst);

                            }
                            await _mNhanVienRepository.AddAsync(nhanVienHS);
                        }
                        else
                        {
                            var getNhanVien = await _mNhanVienRepository.GetFirstOrDefaultAsync(x => x.So_NV == request.So_NV && x.DonVi == request.DonVi && x.Deleted == 0);
                            if (getNhanVien == null)
                            {
                                _mNhanVienRepository.CommitTransactionAsync();
                                return -1;
                            }
                            _mapper.Map(request, getNhanVien);
                            if (request.ListFile?.Count > 0)
                            {
                                List<M_NhanVien_HoSo> lst = new List<M_NhanVien_HoSo>();
                                foreach (var item in request.ListFile)
                                {
                                    M_NhanVien_HoSo nv = new M_NhanVien_HoSo();
                                    nv.So_NV = nhanVienHS.So_NV;
                                    nv.File_Name = item.File_Name ?? "";
                                    nv.File_URL = item.File_URL ?? "";
                                    nv.File_Start = item.File_Start;
                                    nv.File_End = item.File_End;
                                    nv.File_Warning = item.File_Warning;
                                    nv.DonVi = request.DonVi;
                                    lst.Add(nv);
                                }
                                await _nhanVienHoSoRepository.AddRangeAsync(lst);
                            }
                            await _mNhanVienRepository.UpdateAsync(getNhanVien);

                        }

                        _logger.LogInformation($"Ho So Nhan Vien {Unit.Value} is successfully created.");
                    }
                    _mNhanVienRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _mNhanVienRepository.RollbackTransactionAsync();
                    return -1;
                    throw;
                }

            }
        }
    }
}
