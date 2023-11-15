using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;
using System.Text;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Application.Features.LichSuCongTacNhanVien.Commands
{
    public class AddLichLamViecCommand
    {
        public class AddLichSuCongTacRequest : IRequest<int>
        {
            public class LichLamViecNew
            {
                public int So_NV { get; set; }
                public string? Ma_NV { get; set; }
                public string? Ten_NV { get; set; }
                public int? Status { get; set; }
                public int? D01 { get; set; }
                public int? D02 { get; set; }
                public int? D03 { get; set; }
                public int? D04 { get; set; }
                public int? D05 { get; set; }
                public int? D06 { get; set; }
                public int? D07 { get; set; }
                public int? D08 { get; set; }
                public int? D09 { get; set; }
                public int? D10 { get; set; }
                public int? D11 { get; set; }
                public int? D12 { get; set; }
                public int? D13 { get; set; }
                public int? D14 { get; set; }
                public int? D15 { get; set; }
                public int? D16 { get; set; }
                public int? D17 { get; set; }
                public int? D18 { get; set; }
                public int? D19 { get; set; }
                public int? D20 { get; set; }
                public int? D21 { get; set; }
                public int? D22 { get; set; }
                public int? D23 { get; set; }
                public int? D24 { get; set; }
                public int? D25 { get; set; }
                public int? D26 { get; set; }
                public int? D27 { get; set; }
                public int? D28 { get; set; }
                public int? D29 { get; set; }
                public int? D30 { get; set; }
                public int? D31 { get; set; }
                public Int64 Timestamp { get; set; }
            }
            public List<LichLamViecNew>? ListLichLamViecNew { get; set; }
            public int DonVi { get; set; }
            public int? Month { get; set; }
            public int? Year { get; set; }
        }
        public class Handler : IRequestHandler<AddLichSuCongTacRequest, int>
        {
            private readonly ILichLamViecNVRepository _lichLamViecNhanVienRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddLichLamViecCommand> _logger;
            public Handler(ILichLamViecNVRepository lichLamViecNhanVienRepository, IDonViRepository donViRepository, IMapper mapper, ILogger<AddLichLamViecCommand> logger)
            {
                _lichLamViecNhanVienRepository = lichLamViecNhanVienRepository ?? throw new ArgumentNullException(nameof(lichLamViecNhanVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }
            public async Task<int> Handle(AddLichSuCongTacRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        return 0;
                    }
                    
                    if (request.ListLichLamViecNew != null && request.ListLichLamViecNew.Count > 0)
                    {
                        List<T_LichCongTac_NhanVien> lst = new List<T_LichCongTac_NhanVien>();
                        foreach (var item in request.ListLichLamViecNew)
                        {
                            T_LichCongTac_NhanVien? checkLich = null;
                            if (!string.IsNullOrEmpty(item.Timestamp+""))
                            {
                                checkLich = await GetLichById(request.DonVi, request.Month, request.Year, item.So_NV);
                                if (checkLich != null)
                                {
                                    //var currentTs = BitConverter.ToUInt64(checkLich.Timestamp, 0).ToString();
                                    //var currentTs1 = BitConverter.ToUInt64(bytes, 0).ToString();
                                    if (!BitConverter.GetBytes(item.Timestamp).Reverse().ToArray().SequenceEqual(checkLich.Timestamp))
                                        return -2;
                                }
                            }

                            Expression<Func<T_LichCongTac_NhanVien, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi 
                                    && u.So_NV == item.So_NV && u.Month == request.Month && u.Year == request.Year;
                            var checkCa = await _lichLamViecNhanVienRepository.GetFirstOrDefaultAsync(fillter);
                            if (checkCa == null)
                            {
                                T_LichCongTac_NhanVien ca = new T_LichCongTac_NhanVien();
                                ca.So_NV = item.So_NV;
                                ca.Month = request.Month;
                                ca.Year = request.Year;
                                ca.Ma_NV = item.Ma_NV;
                                ca.Ten_NV = item.Ten_NV;
                                ca.Status = item.Status;
                                ca.D01 = item.D01;
                                ca.D02 = item.D02;
                                ca.D03 = item.D03;
                                ca.D04 = item.D04;
                                ca.D05 = item.D05;
                                ca.D06 = item.D06;
                                ca.D07 = item.D07;
                                ca.D08 = item.D08;
                                ca.D09 = item.D09;
                                ca.D10 = item.D10;
                                ca.D11 = item.D11;
                                ca.D12 = item.D12;
                                ca.D13 = item.D13;
                                ca.D14 = item.D14;
                                ca.D15 = item.D15;
                                ca.D16 = item.D16;
                                ca.D17 = item.D17;
                                ca.D18 = item.D18;
                                ca.D19 = item.D19;
                                ca.D20 = item.D20;
                                ca.D21 = item.D21;
                                ca.D22 = item.D22;
                                ca.D23 = item.D23;
                                ca.D24 = item.D24;
                                ca.D25 = item.D25;
                                ca.D26 = item.D26;
                                ca.D27 = item.D27;
                                ca.D28 = item.D28;
                                ca.D29 = item.D29;
                                ca.D30 = item.D30;
                                ca.D31 = item.D31;
                                ca.DonVi = request.DonVi;
                                lst.Add(ca);
                                await _lichLamViecNhanVienRepository.AddRangeAsync(lst);
                                lst.Clear();
                            }
                            else
                            {
                                checkCa.D01 = item.D01;
                                checkCa.D02 = item.D02;
                                checkCa.D03 = item.D03;
                                checkCa.D04 = item.D04;
                                checkCa.D05 = item.D05;
                                checkCa.D06 = item.D06;
                                checkCa.D07 = item.D07;
                                checkCa.D08 = item.D08;
                                checkCa.D09 = item.D09;
                                checkCa.D10 = item.D10;
                                checkCa.D11 = item.D11;
                                checkCa.D12 = item.D12;
                                checkCa.D13 = item.D13;
                                checkCa.D14 = item.D14;
                                checkCa.D15 = item.D15;
                                checkCa.D16 = item.D16;
                                checkCa.D17 = item.D17;
                                checkCa.D18 = item.D18;
                                checkCa.D19 = item.D19;
                                checkCa.D20 = item.D20;
                                checkCa.D21 = item.D21;
                                checkCa.D22 = item.D22;
                                checkCa.D23 = item.D23;
                                checkCa.D24 = item.D24;
                                checkCa.D25 = item.D25;
                                checkCa.D26 = item.D26;
                                checkCa.D27 = item.D27;
                                checkCa.D28 = item.D28;
                                checkCa.D29 = item.D29;
                                checkCa.D30 = item.D30;
                                checkCa.D31 = item.D31;
                                await _lichLamViecNhanVienRepository.UpdateAsync(checkCa);
                            }

                        }
                        _logger.LogInformation($"Lich cong tac nhan vien {Unit.Value} is successfully created.");
                        return 1;
                    }
                    else
                    {
                        return -1;
                    }

                }
                catch (Exception ex)
                {
                    return -1;
                    throw;
                }

            }
            private async Task<T_LichCongTac_NhanVien> GetLichById(int? donVi, int? month, int? year, int soNV)
            {
                var lst = await _lichLamViecNhanVienRepository.GetTableLichCongTac(soNV, month, year, donVi);
                return lst;
            }
        }
    }
}
