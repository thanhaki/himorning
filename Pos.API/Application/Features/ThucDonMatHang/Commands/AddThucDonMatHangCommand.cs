using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.ThucDonMatHang.Commands
{
    public class AddThucDonMatHangCommand
    {
        public class AddThucDonMHRequest : IRequest<int>
        {
            public int? Ma_MH { get; set; } 
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddThucDonMHRequest, int>
        {
            private readonly IThucDonMatHangRepository _ThucDonMHRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddThucDonMatHangCommand> _logger;
            private readonly IDonViRepository _donViRepository;
            public Handler(IThucDonMatHangRepository ThucDonMHRepository, IDonViRepository donViRepository, IMapper mapper, ILogger<AddThucDonMatHangCommand> logger)
            {
                _ThucDonMHRepository = ThucDonMHRepository ?? throw new ArgumentNullException(nameof(DonViMatHangRepository));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(AddThucDonMHRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                if (donVi == null)
                {
                    return 0;
                }
                var thuDon = _mapper.Map<M_ThucDon_MatHang>(request);
                if (thuDon != null)
                {
                    Func<IQueryable<M_ThucDon_MatHang>, IOrderedQueryable<M_ThucDon_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_TD);
                    var maxId = await _ThucDonMHRepository.GetMaxIdAsync(orderingFunc);
                    thuDon.Ma_TD = maxId == null ? 1 : maxId.Ma_TD + 1;
                    await _ThucDonMHRepository.AddAsync(thuDon);
                }
                return 1;
            }
        }
    }
}
