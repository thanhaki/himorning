using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DanhMuc.Commands
{
    public class DeleteDanhMucCommand
    {
        public class DeleteDanhMucRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int? DonVi { get; set; }
        }

        public class Handler : IRequestHandler<DeleteDanhMucRequest>
        {
            private readonly IDanhMucMHRepository _danhMucRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteDanhMucCommand> _logger;
            public Handler(IDanhMucMHRepository danhMucRepository, IMapper mapper, ILogger<DeleteDanhMucCommand> logger)
            {
                _danhMucRepository = danhMucRepository ?? throw new ArgumentNullException(nameof(danhMucRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(DeleteDanhMucRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DanhMuc_MatHang, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.Ma_DanhMuc);
                var listDM = await _danhMucRepository.GetAsync(getByid);
                listDM.ToList().ForEach(item => item.Deleted = 1);
                await _danhMucRepository.UpdateRangeAsync(listDM.ToList());
				_logger.LogInformation($"Danh Muc {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}
