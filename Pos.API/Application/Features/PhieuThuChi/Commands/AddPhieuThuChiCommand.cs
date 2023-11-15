using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PhieuThuChi.Commands
{
    public class AddPhieuThuChiCommand
    {
        public class AddPhieuThuChiRequest : IRequest<int>
        {
            public int Loai_PhieuThuChi { get; set; }
            public int MaDanhMucThuChi { get; set; }
            public DateTime? NgayLapPhieu { get; set; }
            public string? ThoiGianGhiNhan { get; set; }
            public int MaNhomDoiTuong { get; set; }
            public int MaDoiTuong { get; set; }
            public decimal GiaTriThuChi { get; set; }
            public int? HoachToanKinhDoanh { get; set; }
            public int SoHinhThucThanhToan { get; set; }
            public string? CreateBy { get; set; }
            public string? NoiDung { get; set; }
            public string? FileThuChi { get; set; }
            public int DonVi { get; set; }
            public int? Deleted { get; set; }
        }

        public class Handler : IRequestHandler<AddPhieuThuChiRequest, int>
        {
            private readonly IPhieuThuChiRepository _phieuThuChiRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddPhieuThuChiCommand> _logger;

            public Handler(IPhieuThuChiRepository phieuThuChiRepository, IMapper mapper, ILogger<AddPhieuThuChiCommand> logger, IDonViRepository donViRepository)
            {
                _phieuThuChiRepository = phieuThuChiRepository ?? throw new ArgumentNullException(nameof(phieuThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(AddPhieuThuChiRequest request, CancellationToken cancellationToken)
            {
                var PTC = _mapper.Map<T_PhieuThuChi>(request);
                if (PTC != null)
                {

                    Expression<Func<M_DonVi, bool>> predicate = u => u.DonVi == request.DonVi && u.Deleted == 0;
                    var donvi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donvi == null) return 0;

                    Func<IQueryable<T_PhieuThuChi>, IOrderedQueryable<T_PhieuThuChi>> orderingFunc = x => x.OrderByDescending(X => X.So_PhieuThuChi);
                    var maxId = await _phieuThuChiRepository.GetMaxIdAsync(orderingFunc);

                    string code = request.Loai_PhieuThuChi == 1 ? "PT" : "PC";
                    string maPhieuthuChi = Utilities.FormatCode(code, 10, "0");

                    Func<IQueryable<T_PhieuThuChi>, IOrderedQueryable<T_PhieuThuChi>> orderCodeThuChi = x => x.OrderByDescending(X => X.Ma_PhieuThuChi);
                    Expression<Func<T_PhieuThuChi, bool>> fillter_MH = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Loai_PhieuThuChi == request.Loai_PhieuThuChi;
                    var maxMaPhieuThuChi = await _phieuThuChiRepository.GetAsync(fillter_MH, orderCodeThuChi);
                    if (maxMaPhieuThuChi != null && maxMaPhieuThuChi.Count() > 0)
                    {
                        var first = maxMaPhieuThuChi.FirstOrDefault();
                        maPhieuthuChi = Utilities.FormatCode(code, 10, first.Ma_PhieuThuChi);
                    }

                    PTC.So_PhieuThuChi = maxId == null ? 1 : maxId.So_PhieuThuChi + 1;
                    PTC.Ma_PhieuThuChi = maPhieuthuChi;

                    await _phieuThuChiRepository.AddAsync(PTC);
                    _logger.LogInformation($"Phieu Thu Chi {Unit.Value} is successfully created.");
                }
                return 1;
            }
        }
    }
}
