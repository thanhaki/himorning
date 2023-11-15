using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.CaLamViec.Commands
{
    public class UpdateCaLamViecCommand
    {
        public class UpdateCaLamViecRequest : IRequest<int>
        {
            public int DonVi { get; set; }
            public class CaLamViecUd
            {
                public int So_CaLamViec { get; set; }
                public string? Ma_CaLamViec { get; set; }
                public string? MoTa_CaLamViec { get; set; }
                public double? HeSo_CaLamViec { get; set; }
            }
            public List<CaLamViecUd>? ListCaLamViecUd { get; set; }
        }

        public class Handler : IRequestHandler<UpdateCaLamViecRequest,int>
        {
            private readonly ICaLamViecRepository _caLamViecRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateCaLamViecCommand> _logger;
            public Handler(ICaLamViecRepository caLamViecRepository, IDonViRepository donViRepository, IMapper mapper, ILogger<UpdateCaLamViecCommand> logger)
            {
                _caLamViecRepository = caLamViecRepository ?? throw new ArgumentNullException(nameof(caLamViecRepository));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<int> Handle(UpdateCaLamViecRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        return 0;
                    }

                    if (request.ListCaLamViecUd != null && request.ListCaLamViecUd.Count > 0)
                    {
                        List<M_CaLamViec> lst = new List<M_CaLamViec>();
                        var duplicateKeys = request.ListCaLamViecUd.GroupBy(x => x.Ma_CaLamViec)
                           .Where(g => g.Count() > 1)
                           .Select(g => g.Key).ToList();
                        if (duplicateKeys.Count > 0)
                        {
                            return 2;
                        }
                        foreach (var item in request.ListCaLamViecUd)
                        {
                            Expression<Func<M_CaLamViec, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.So_CaLamViec == item.So_CaLamViec;
                            var update = await _caLamViecRepository.GetFirstOrDefaultAsync(fillter);
                            if (update != null)
                            {
                                update.Ma_CaLamViec = item.Ma_CaLamViec;
                                update.MoTa_CaLamViec = item.MoTa_CaLamViec;
                                update.HeSo_CaLamViec = item.HeSo_CaLamViec;
                                await _caLamViecRepository.UpdateAsync(update);
                            }

                        }
                    }
                    _logger.LogInformation($"Ca lam viec {Unit.Value} is successfully created.");
                    return 1;
                }
                catch (Exception ex)
                {
                    return -1;
                    throw;
                }
            }
        }
    }
}
