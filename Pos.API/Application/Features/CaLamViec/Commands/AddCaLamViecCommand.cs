using MediatR;
using AutoMapper;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Common;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.CaLamViec.Commands
{
    public class AddCaLamViecCommand
    {
        public class CaLamViecRequest : IRequest<int>
        {
            public int DonVi { get; set; }
            public class CaLamViec
            {
                public string Ma_CaLamViec { get; set; }
                public string? MoTa_CaLamViec { get; set; }
                public double? HeSo_CaLamViec { get; set; }
            }
            public List<CaLamViec>? ListCaLamViec { get; set; }
        }
        public class Handler : IRequestHandler<CaLamViecRequest, int>
        {
            private readonly ICaLamViecRepository _caLamViecRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddCaLamViecCommand> _logger;
            private readonly IDonViRepository _donViRepository;
            public Handler(ICaLamViecRepository caLamViecRepository, IDonViRepository donViRepository, IMapper mapper, ILogger<AddCaLamViecCommand> logger)
            {
                _caLamViecRepository = caLamViecRepository ?? throw new ArgumentNullException(nameof(caLamViecRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }

            public async Task<int> Handle(CaLamViecRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        return 0;
                    }
                    if (request.ListCaLamViec != null && request.ListCaLamViec.Count > 0)
                    {
                        List<M_CaLamViec> lst = new List<M_CaLamViec>();

                        for (int i = 0; i < request.ListCaLamViec.Count; i++)
                        {
                            Expression<Func<M_CaLamViec, bool>> fillter_MH = u => u.Ma_CaLamViec.ToLower() == request.ListCaLamViec[i].Ma_CaLamViec.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                            var check = await _caLamViecRepository.GetFirstOrDefaultAsync(fillter_MH);
                            if (check != null)
                            {
                                return 2;
                            }
                            var maxId = await _caLamViecRepository.GetMaxIdAsync(x => x.OrderByDescending(X => X.So_CaLamViec));

                            M_CaLamViec shift = new M_CaLamViec();
                            shift.So_CaLamViec = (maxId == null ? 1 : maxId.So_CaLamViec + 1) + i;
                            shift.Ma_CaLamViec = request.ListCaLamViec[i].Ma_CaLamViec;
                            shift.MoTa_CaLamViec = request.ListCaLamViec[i].MoTa_CaLamViec;
                            shift.HeSo_CaLamViec = request.ListCaLamViec[i].HeSo_CaLamViec;
                            shift.DonVi = request.DonVi;
                            lst.Add(shift);
                        }
                        await _caLamViecRepository.AddRangeAsync(lst);
                        _logger.LogInformation($"Ca lam viec {Unit.Value} is successfully created.");
                        return 1;
                    }
                    else
                    {
                        return -1;
                    }
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
