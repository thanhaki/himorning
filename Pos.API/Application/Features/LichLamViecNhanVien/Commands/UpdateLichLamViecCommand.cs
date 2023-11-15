using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.LichSuCongTacNhanVien.Commands
{
    public class UpdateLichLamViecCommand
    {
        public class UpdateLichCongTacRequest : IRequest<int>
        {
            public int So_NV { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string? D01 { get; set; }
            public string? D02 { get; set; }
            public string? D03 { get; set; }
            public string? D04 { get; set; }
            public string? D05 { get; set; }
            public string? D06 { get; set; }
            public string? D07 { get; set; }
            public string? D08 { get; set; }
            public string? D09 { get; set; }
            public string? D10 { get; set; }
            public string? D11 { get; set; }
            public string? D12 { get; set; }
            public string? D13 { get; set; }
            public string? D14 { get; set; }
            public string? D15 { get; set; }
            public string? D16 { get; set; }
            public string? D17 { get; set; }
            public string? D18 { get; set; }
            public string? D19 { get; set; }
            public string? D20 { get; set; }
            public string? D21 { get; set; }
            public string? D22 { get; set; }
            public string? D23 { get; set; }
            public string? D24 { get; set; }
            public string? D25 { get; set; }
            public string? D26 { get; set; }
            public string? D27 { get; set; }
            public string? D28 { get; set; }
            public string? D29 { get; set; }
            public string? D30 { get; set; }
            public string? D31 { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdateLichCongTacRequest, int>
        {
            private readonly ILichLamViecNVRepository _lichSuCongTacRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateLichLamViecCommand> _logger;

            public Handler(ILichLamViecNVRepository lichSuCongTacRepository, IMapper mapper, ILogger<UpdateLichLamViecCommand> logger, IDonViRepository donViRepository)
            {
                _lichSuCongTacRepository = lichSuCongTacRepository ?? throw new ArgumentNullException(nameof(lichSuCongTacRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(UpdateLichCongTacRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                if (donVi == null)
                {
                    return 0;
                }
                Expression<Func<T_LichCongTac_NhanVien, bool>> getId = x => x.So_NV == request.So_NV 
                            && x.DonVi == request.DonVi && x.Deleted == 0 && x.Month == request.Month && x.Year == request.Year;
                var t_lichNv = await _lichSuCongTacRepository.GetFirstOrDefaultAsync(getId);
                if (t_lichNv != null)
                {
                    _mapper.Map(request, t_lichNv);
                    await _lichSuCongTacRepository.UpdateAsync(t_lichNv);
                    _logger.LogInformation($"Lich cong tac nhan vien {Unit.Value} is successfully created.");
                    return 1;
                }
                return 0;
            }
        }
    }
}
