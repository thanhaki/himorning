using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DanhMucThuChi.Commands
{
    public class DeleteDanhMucThuChiCommand
    {
        public class DeleteDanhMucThuChiRequest : IRequest<int>
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<DeleteDanhMucThuChiRequest, int>
        {
            private readonly IDanhMucThuChiRepository _DanhMucThuChiRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteDanhMucThuChiCommand> _logger;

            public Handler(
                IMapper mapper,
                IDanhMucThuChiRepository danhMucThuChiRepository, ILogger<DeleteDanhMucThuChiCommand> logger)
            {
                _DanhMucThuChiRepository = danhMucThuChiRepository ?? throw new ArgumentNullException(nameof(danhMucThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(DeleteDanhMucThuChiRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DanhMuc_ThuChi, bool>> predicate = o => request.Ids.Contains(o.MaDanhMucThuChi);
                var danhMucThuChi = await _DanhMucThuChiRepository.GetAsync(predicate);
                if (danhMucThuChi.Count == 0) { return -1; }

                foreach (var item in danhMucThuChi)
                {
                    item.Deleted = 1;
                }

                await _DanhMucThuChiRepository.UpdateRangeAsync(danhMucThuChi.ToList());
                return 1;
            }

        }
    }
}
