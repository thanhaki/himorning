using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.MatHang.Commands
{
    public class AddMatHangCommand
    {
        public class AddMatHangRequest : IRequest<int>
        {
            public string Ten_MH { get; set; }
            public int? Loai_MH { get; set; }
            public int Ma_DanhMuc { get; set; }
            public int? Ma_DonVi { get; set; }
            public string Gia_Ban { get; set; }
            public string Gia_Von { get; set; }
            public bool? IsNhapGiaBan { get; set; } = false;
            public string Mota_MH { get; set; }
            public string MauSac_MH { get; set; }
            public string HinhAnh_MH { get; set; }
            public int Ma_Printer { get; set; }
            public int? SoLuongTonKho { get; set; }
            public bool? TonKho { get; set; }
            public int? TonKhoMin { get; set; }
            public int? DonVi { get; set; }
            public int[] IdThucDon { get; set; }
            public int? ThoiGianApDung { get; set; } = 0;
            public int? LoaiThoiGianApDung { get; set; } = 0;
            public string? QRCode { set; get; }
        }
        public class Handler : IRequestHandler<AddMatHangRequest, int>
        {
            private readonly IMatHangRepository _matHangRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddMatHangCommand> _logger;
            private readonly IThucDonMatHangRepository _ThucDonMHRepository;

            public Handler(IMatHangRepository matHangRepository, IThucDonMatHangRepository ThucDonMHRepository, IMapper mapper, ILogger<AddMatHangCommand> logger, IDonViRepository donViRepository)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _ThucDonMHRepository = ThucDonMHRepository ?? throw new ArgumentNullException(nameof(DonViMatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(AddMatHangRequest request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("Start AddMatHangCommand");
                try
                {
                    _ThucDonMHRepository.BeginTransactionAsync();
                    var matHang = _mapper.Map<M_MatHang>(request);
                    if (matHang != null)
                    {
                        Expression<Func<M_DonVi, bool>> predicate = u => u.DonVi == request.DonVi && u.Deleted == 0;
                        var donvi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                        if (donvi == null)
                        {
                            _ThucDonMHRepository.CommitTransactionAsync();
                            return 0; 
                        }

                        Func<IQueryable<M_MatHang>, IOrderedQueryable<M_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_MH);
                        var maxId = await _matHangRepository.GetMaxIdAsync(orderingFunc);

                        Expression<Func<M_MatHang, bool>> fillter_MH = u => u.Ten_MH.ToLower() == request.Ten_MH.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var checkDm = await _matHangRepository.GetFirstOrDefaultAsync(fillter_MH);
                        if (checkDm != null)
                        {
                            _ThucDonMHRepository.CommitTransactionAsync();
                            return -1;
                        }

                        //check QR code
                        if (!string.IsNullOrEmpty(request.QRCode))
                        {
                            fillter_MH = u => u.QRCode == request.QRCode && u.Deleted == 0 && u.DonVi == request.DonVi;
                            var checkQRCode = await _matHangRepository.GetFirstOrDefaultAsync(fillter_MH);
                            if (checkQRCode != null)
                            {
                                _ThucDonMHRepository.CommitTransactionAsync();
                                return -2;
                            }
                        }

                        matHang.Ma_MH = maxId == null ? 1 : maxId.Ma_MH + 1;

                        List<M_ThucDon_MatHang> lst = new List<M_ThucDon_MatHang>();
                        for (int i = 0; i < request.IdThucDon.Length; i++)
                        {
                            M_ThucDon_MatHang td = new M_ThucDon_MatHang();
                            td.Ma_TD = request.IdThucDon[i];
                            td.Ma_MH = matHang.Ma_MH;
                            td.DonVi = matHang.DonVi;
                            lst.Add(td);
                        }
                        string giaBan = request.Gia_Ban.ToString().Replace(".", "");
                        string giaVon = request.Gia_Von.ToString().Replace(".", "");
                        matHang.Gia_Ban = Convert.ToDecimal(giaBan);
                        matHang.Gia_Von = Convert.ToDecimal(giaVon);
                        await _matHangRepository.AddAsync(matHang);
                        await _ThucDonMHRepository.AddRangeAsync(lst);

                        _logger.LogInformation($"Mat Hang {Unit.Value} is successfully created.");
                    }
                    _ThucDonMHRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _ThucDonMHRepository.RollbackTransactionAsync();
                    return 0;
                }
            }
        }
    }
}
