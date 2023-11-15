using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DanhMuc.Commands
{
    public class UpdateDanhMucMatHangCommand
    {
        public class UpdateDanhMucRequest : IRequest
        {
            public int Ma_DanhMuc { get; set; }
            public int DonVi { get; set; }
            public string? Ten_DanhMuc { get; set; }
        }

        public class Handler : IRequestHandler<UpdateDanhMucRequest>
        {
            private readonly IDanhMucMHRepository _danhMucRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateDanhMucMatHangCommand> _logger;
            public Handler(IDanhMucMHRepository danhMucRepository, IMapper mapper, ILogger<UpdateDanhMucMatHangCommand> logger)
            {
                _danhMucRepository = danhMucRepository ?? throw new ArgumentNullException(nameof(danhMucRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(UpdateDanhMucRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DanhMuc_MatHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_DanhMuc == request.Ma_DanhMuc;
                var result = await _danhMucRepository.GetFirstOrDefaultAsync(fillter);
                if (result != null)
                {
                    _mapper.Map(request, result);
                    await _danhMucRepository.UpdateAsync(result);
                    _logger.LogInformation($"Danh Muc {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
