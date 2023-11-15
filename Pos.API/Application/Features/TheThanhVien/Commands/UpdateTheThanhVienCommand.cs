using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.TheThanhVien.Commands
{
    public class UpdateTheThanhVienCommand
    {
        public class UpdateTheThanhVienRequest : IRequest
        {
            public int Ma_TTV { get; set; }
            public string Ten_TTV { get; set; }
            public int DiemToiThieu { get; set; }
            public int DiemToiDa { get; set; }
            public decimal TyLeQuyDoi { get; set; }
            public string MieuTa { get; set; }
            public string GhiChu_TTV { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdateTheThanhVienRequest>
        {
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateTheThanhVienCommand> _logger;
            public Handler(ITheThanhVienRepository theThanhVienRepository, IMapper mapper, ILogger<UpdateTheThanhVienCommand> logger)
            {
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateTheThanhVienRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_TheThanhVien, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_TTV == request.Ma_TTV;

                var theTv = await _theThanhVienRepository.GetFirstOrDefaultAsync(fillter);
                if (theTv != null)
                {
                    _mapper.Map(request, theTv);
                    await _theThanhVienRepository.UpdateAsync(theTv);
                    _logger.LogInformation($"The thanh vien {Unit.Value} is successfully updated.");
                }
                return Unit.Value;
            }
        }
    }
}
