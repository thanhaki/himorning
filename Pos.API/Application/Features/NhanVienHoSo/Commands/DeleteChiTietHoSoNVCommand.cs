using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhanVienHoSo.Commands
{
    public class DeleteChiTietHoSoNVCommand
    {
        public class DeleteCTHoSoNVRequest : IRequest
        {
            public int File_No { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<DeleteCTHoSoNVRequest>
        {
            private readonly INhanVienHoSoRepository _nhanVienHoSoRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteChiTietHoSoNVCommand> _logger;
            public Handler(INhanVienHoSoRepository nhanVienHoSoRepository,
                IMapper mapper, ILogger<DeleteChiTietHoSoNVCommand> logger)
            {
                _nhanVienHoSoRepository = nhanVienHoSoRepository ?? throw new ArgumentNullException(nameof(nhanVienHoSoRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(DeleteCTHoSoNVRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_NhanVien_HoSo, bool>> getChiTietHs = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.File_No == request.File_No;
                var listFileHs = await _nhanVienHoSoRepository.GetAsync(getChiTietHs);
                if (listFileHs.Count > 0)
                {
                    await _nhanVienHoSoRepository.DeleteRangeAsync(listFileHs.ToList());
                }

                _logger.LogInformation($"File ho so nhan vien {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}