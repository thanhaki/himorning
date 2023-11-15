using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DanhMucThuChi.Commands
{
    public class AddDanhMucThuChiCommand
    {
        public class AddDanhMucThuChiRequest : IRequest<int>
        {
            public int Loai_DanhMucThuChi { get; set; }
            public string? Ten_DanhMucThuChi { get; set; }
            public string? GhiChu_DanhMucThuChi { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<AddDanhMucThuChiRequest, int>
        {
            private readonly IDanhMucThuChiRepository _DanhMucThuChiRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddDanhMucThuChiCommand> _logger;

            public Handler(IDanhMucThuChiRepository danhMucThuChiRepository, IMapper mapper, ILogger<AddDanhMucThuChiCommand> logger, IDonViRepository donViRepository)
            {
                _DanhMucThuChiRepository = danhMucThuChiRepository ?? throw new ArgumentNullException(nameof(danhMucThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(AddDanhMucThuChiRequest request, CancellationToken cancellationToken)
            {
                var danhMucThuChi = _mapper.Map<M_DanhMuc_ThuChi>(request);
                if (danhMucThuChi != null)
                {

                    Expression<Func<M_DonVi, bool>> predicate = u => u.DonVi == request.DonVi && u.Deleted == 0;
                    var donvi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donvi == null) return 0;

                    Func<IQueryable<M_DanhMuc_ThuChi>, IOrderedQueryable<M_DanhMuc_ThuChi>> orderingFunc = x => x.OrderByDescending(X => X.MaDanhMucThuChi);
                    var maxId = await _DanhMucThuChiRepository.GetMaxIdAsync(orderingFunc);
                    danhMucThuChi.MaDanhMucThuChi = maxId == null ? 1 : maxId.MaDanhMucThuChi + 1;
                    await _DanhMucThuChiRepository.AddAsync(danhMucThuChi);
                    _logger.LogInformation($"Danh mục thu chi {Unit.Value} tạo thành côn.");
                }
                return 1;
            }
        }
    }
}
