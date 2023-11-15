using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Diagnostics.Metrics;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.MatHang.Commands
{
    public class UpdateMatHangCommand
    {
        public class UpdateMatHangRequest : IRequest<int>
        {
            public int Ma_MH { get; set; }
            public string Ten_MH { get; set; }
            public int Loai_MH { get; set; }
            public int Ma_DanhMuc { get; set; }
            public string Ma_DonVi { get; set; }
            public decimal Gia_Ban { get; set; }
            public decimal Gia_Von { get; set; }
            public bool? IsNhapGiaBan { get; set; } = false;
            public string Mota_MH { get; set; }
            public string MauSac_MH { get; set; }
            public string HinhAnh_MH { get; set; }
            public int? Ma_Printer { get; set; }
            public int? SoLuongTonKho { get; set; }
            public bool? TonKho { get; set; }
            public int? TonKhoMin { get; set; }
            public int? DonVi { get; set; }
            public int[] IdThucDon { get; set; }
            public string ImgOld { get; set; }
            public int? ThoiGianApDung { get; set; } = 0;
            public int? LoaiThoiGianApDung { get; set; } = 0;
            public string? QRCode { set; get; }
        }
        public class Handler : IRequestHandler<UpdateMatHangRequest,int>
        {
            private readonly IMatHangRepository _matHangRepository;
            private readonly IThucDonMatHangRepository _thucDonMatHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateMatHangCommand> _logger;
            public Handler(IMatHangRepository matHangRepository, IThucDonMatHangRepository thucDonMatHangRepository, IMapper mapper, ILogger<UpdateMatHangCommand> logger)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _thucDonMatHangRepository = thucDonMatHangRepository ?? throw new ArgumentNullException(nameof(DonViMatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(UpdateMatHangRequest request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("Start UpdateMatHangCommand");

                try
                {
                    _thucDonMatHangRepository.BeginTransactionAsync();

                    Expression<Func<M_MatHang, bool>> fillter_MH = u => u.Ten_MH.ToLower() == request.Ten_MH.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                    var checkName = await _matHangRepository.GetFirstOrDefaultAsync(fillter_MH);
                    if (checkName != null && checkName.Ten_MH.ToLower() != request.Ten_MH.ToLower())
                    {
                        _thucDonMatHangRepository.CommitTransactionAsync();
                        return -1;
                    }

                    //check QR code
                    if (!string.IsNullOrEmpty(request.QRCode))
                    {
                        fillter_MH = u => u.QRCode == request.QRCode && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var checkQRCode = await _matHangRepository.GetAsync(fillter_MH);
                        if (checkQRCode.Count > 0 && checkQRCode != null && (checkQRCode.Count > 1 || checkQRCode.FirstOrDefault(x=>x.Ma_MH == request.Ma_MH) == null))
                        {
                            _thucDonMatHangRepository.CommitTransactionAsync();
                            return -2;
                        }
                    }

                    //delete chi tiet M_ThucDon_MatHang old add moi chi tiet
                    Expression<Func<M_ThucDon_MatHang, bool>> getByid = x => x.Deleted == 0 && x.Ma_MH == request.Ma_MH && x.DonVi == request.DonVi;
                    var lst = await _thucDonMatHangRepository.GetAsync(getByid);
                    foreach (var item in lst)
                    {
                        await _thucDonMatHangRepository.DeleteAsync(item);
                    }
                    //add lai chi tiet M_ThucDon_MatHang
                    List<M_ThucDon_MatHang> lstCt = new List<M_ThucDon_MatHang>();
                    for (int i = 0; i < request.IdThucDon.Length; i++)
                    {
                        M_ThucDon_MatHang td = new M_ThucDon_MatHang();
                        td.Ma_TD = request.IdThucDon[i];
                        td.Ma_MH = request.Ma_MH;
                        td.DonVi = (int)request.DonVi;
                        lstCt.Add(td);
                    }
                    if (lstCt.Count > 0)
                    {
                        await _thucDonMatHangRepository.AddRangeAsync(lstCt);
                    }

                    //update M_MatHang
                    Expression<Func<M_MatHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_MH == request.Ma_MH;

                    var matHang = await _matHangRepository.GetFirstOrDefaultAsync(fillter);
                    if (matHang != null)
                    {
                        _mapper.Map(request, matHang);
                        string giaBan = request.Gia_Ban.ToString().Replace(",", "");
                        string giaVon = request.Gia_Von.ToString().Replace(",", "");
                        matHang.Gia_Ban = Convert.ToDecimal(giaBan);
                        matHang.Gia_Von= Convert.ToDecimal(giaVon);
                        matHang.HinhAnh_MH = request.HinhAnh_MH == null ? request.ImgOld : request.HinhAnh_MH;
                        await _matHangRepository.UpdateAsync(matHang);
                        _logger.LogInformation($"Mat Hang {Unit.Value} is successfully updated.(UpdateMatHangCommand)");
                    }
                    _logger.LogInformation($"Mat Hang {Unit.Value} is successfully udpate.");
                    _thucDonMatHangRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception)
                {
                    _thucDonMatHangRepository.RollbackTransactionAsync();
                    return 0;
                }
                
            }
        }
    }
}
