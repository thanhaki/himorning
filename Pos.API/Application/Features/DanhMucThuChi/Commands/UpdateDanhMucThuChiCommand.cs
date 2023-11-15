using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using static Pos.API.Application.Features.Printer.Commands.UpdatePrinterCommand;

namespace Pos.API.Application.Features.DanhMucThuChi.Commands
{
    public class UpdateDanhMucThuChiCommand
    {

        public class UpdateDanhMucThuChiRequest : IRequest
        {
            public int MaDanhMucThuChi { get; set; }
            public int Loai_DanhMucThuChi { get; set; }
            public string? Ten_DanhMucThuChi { get; set; }
            public string? GhiChu_DanhMucThuChi { get; set; }
            public int Deleted { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdateDanhMucThuChiRequest>
        {
            private readonly IDanhMucThuChiRepository _DanhMucThuChiRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateDanhMucThuChiRequest> _logger;
            public Handler(IDanhMucThuChiRepository danhMucThuChiRepository, IMapper mapper, ILogger<UpdateDanhMucThuChiRequest> logger)
            {
                _DanhMucThuChiRepository = danhMucThuChiRepository ?? throw new ArgumentNullException(nameof(danhMucThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(UpdateDanhMucThuChiRequest request, CancellationToken cancellationToken)
            {
                var result = await _DanhMucThuChiRepository.GetByIdAsync(request.MaDanhMucThuChi);
                if (result != null)
                {
                    _mapper.Map(request, result);
                    await _DanhMucThuChiRepository.UpdateAsync(result);
                    _logger.LogInformation($"Cập nhật danh mục thu chi {Unit.Value} thành công.");
                }
                return Unit.Value;
            }
        }
    }
}
