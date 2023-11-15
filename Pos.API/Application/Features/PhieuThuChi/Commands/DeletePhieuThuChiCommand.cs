using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PhieuThuChi.Commands
{
    public class DeletePhieuThuChiCommand
    {
        public class DeletePhieuThuChiRequest : IRequest<int>
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<DeletePhieuThuChiRequest, int>
        {
            private readonly IPhieuThuChiRepository _phieuThuChiRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeletePhieuThuChiCommand> _logger;

            public Handler(
                IMapper mapper,
                IPhieuThuChiRepository phieuThuChiRepository, ILogger<DeletePhieuThuChiCommand> logger)
            {
                _phieuThuChiRepository = phieuThuChiRepository ?? throw new ArgumentNullException(nameof(phieuThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(DeletePhieuThuChiRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<T_PhieuThuChi, bool>> predicate = o => request.Ids.Contains(o.So_PhieuThuChi);
                var phieuthuchi = await _phieuThuChiRepository.GetAsync(predicate);
                if (phieuthuchi.Count == 0) { return -1; }

                foreach (var item in phieuthuchi)
                {
                    item.Deleted = 1;
                }

                await _phieuThuChiRepository.UpdateRangeAsync(phieuthuchi.ToList());
                return 1;
            }

        }
    }
}
