using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.MatHang.Commands
{
    public class ImportProductCommand
    {
        public class ImportProductRequest : IRequest<int>
        {
            public string? ten_MH { get; set; }
            public int? Loai_MH { get; set; }
            public int? ma_DanhMuc { get; set; }
            public int? ma_DonVi { get; set; }
            public int gia_Ban { get; set; }
            public int gia_Von { get; set; }
            public bool? IsNhapGiaBan { get; set; }
            public string? mota_MH { get; set; }
            public int? soLuongTonKho { get; set; }
            public string? QRCode { get; set; }
            public int? TonKhoMin { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<ImportProductRequest, int>
        {
            private readonly IMatHangRepository _matHangRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<ImportProductCommand> _logger;

            public Handler(IMatHangRepository matHangRepository, IMapper mapper, ILogger<ImportProductCommand> logger, IDonViRepository donViRepository)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(ImportProductRequest request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("Start ImportProductCommand");
                try
                {
                    var matHang = _mapper.Map<M_MatHang>(request);
                    if (matHang != null)
                    {
                        Expression<Func<M_DonVi, bool>> predicate = u => u.DonVi == request.DonVi && u.Deleted == 0;
                        var donvi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                        if (donvi == null)
                            return 0;

                        Func<IQueryable<M_MatHang>, IOrderedQueryable<M_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_MH);
                        var maxId = await _matHangRepository.GetMaxIdAsync(orderingFunc);

                        matHang.Ma_MH = maxId == null ? 1 : maxId.Ma_MH + 1;
                        await _matHangRepository.AddAsync(matHang);

                        _logger.LogInformation($"Import Mat Hang {Unit.Value} is successfully created.");
                    }
                    return 1;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }
    }
}
