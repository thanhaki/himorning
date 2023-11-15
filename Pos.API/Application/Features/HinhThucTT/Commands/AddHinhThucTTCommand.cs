using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.HinhThucTT.Commands
{
    public class AddHinhThucTTCommand
    {
        public class AddHinhThucTTRequest : IRequest<int>
        {
            public int DonVi { get; set; }
            public int TinhTrangHinhThucThanhToan { get; set; }
            public class HinhThucThanhToan
            {
                public int MaHinhThucThanhToan { get; set; }
                public string TenHinhThucThanhToan { get; set; }
                //public string? HinhAnhHinhThucThanhToan { get; set; }
            }
            public List<HinhThucThanhToan> ListHinhTTT{ get; set; }
    }
        public class Handler : IRequestHandler<AddHinhThucTTRequest, int>
        {
            private readonly IHinhThucTTRepository _hinhThucTTRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddHinhThucTTCommand> _logger;
            public Handler(IHinhThucTTRepository hinhThucTTRepository, IDonViRepository donViRepository, IMapper mapper, ILogger<AddHinhThucTTCommand> logger)
            {
                _hinhThucTTRepository = hinhThucTTRepository ?? throw new ArgumentNullException(nameof(hinhThucTTRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }

            public async Task<int> Handle(AddHinhThucTTRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _hinhThucTTRepository.BeginTransactionAsync();
                    Expression<Func<M_DonVi, bool>> predicate = u => u.DonVi == request.DonVi && u.Deleted == 0;
                    var donvi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donvi == null)
                    {
                        _hinhThucTTRepository.CommitTransactionAsync();
                        return 0;
                    }
                    var httt = _mapper.Map<M_HinhThucThanhToan>(request);
                    if (httt != null)
                    {
                        if (request.ListHinhTTT.Count > 0)
                        {
                            List<M_HinhThucThanhToan> lst = new List<M_HinhThucThanhToan>();
                            foreach (var item in request.ListHinhTTT)
                            {
                                Func<IQueryable<M_HinhThucThanhToan>, IOrderedQueryable<M_HinhThucThanhToan>> orderingFunc = x => x.OrderByDescending(X => X.SoHinhThucThanhToan);
                                var maxId = await _hinhThucTTRepository.GetMaxIdAsync(orderingFunc);
                                M_HinhThucThanhToan ht = new M_HinhThucThanhToan();

                                ht.SoHinhThucThanhToan = maxId == null ? 1 : maxId.SoHinhThucThanhToan + 1;
                                ht.MaHinhThucThanhToan = item.MaHinhThucThanhToan;
                                ht.TenHinhThucThanhToan = item.TenHinhThucThanhToan;
                                ht.TinhTrangHinhThucThanhToan = request.TinhTrangHinhThucThanhToan;
                                ht.DonVi = request.DonVi;
                                //ht.HinhAnhHinhThucThanhToan = item.HinhAnhHinhThucThanhToan;
                                lst.Add(ht);
                                await _hinhThucTTRepository.AddRangeAsync(lst);
                                lst.Clear();
                            }
                        }
                        _logger.LogInformation($"Hinh thuc thanh toan {Unit.Value} is successfully created.");
                    }
                    _hinhThucTTRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _hinhThucTTRepository.RollbackTransactionAsync();
                    return -1;
                    throw;
                }
            }
        }
    }
}
