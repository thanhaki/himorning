using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DanhMuc.Commands
{
    public class AddDanhMucCommand
    {
        public class AddDanhMucRequest : IRequest<int>
        {
            public string? Ten_DanhMuc { get; set; }
            public int? DonVi { get; set; }
        }

        public class Handler : IRequestHandler<AddDanhMucRequest, int>
        {
            private readonly IDanhMucMHRepository _danhMucRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddDanhMucCommand> _logger;
            public Handler(IDanhMucMHRepository danhMucRepository, IMapper mapper, ILogger<AddDanhMucCommand> logger, IDonViRepository donViRepository)
            {
                _danhMucRepository = danhMucRepository ?? throw new ArgumentNullException(nameof(danhMucRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(AddDanhMucRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _danhMucRepository.BeginTransactionAsync();
                    var danhMuc = _mapper.Map<M_DanhMuc_MatHang>(request);
                    if (danhMuc != null)
                    {
                        Expression<Func<M_DonVi, bool>> predicate = u => u.DonVi == request.DonVi && u.Deleted == 0;
                        var donvi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                        if (donvi == null)
                        {
                            _danhMucRepository.CommitTransactionAsync();
                            return 0;
                        }

                        Func<IQueryable<M_DanhMuc_MatHang>, IOrderedQueryable<M_DanhMuc_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_DanhMuc);
                        var maxId = await _danhMucRepository.GetMaxIdAsync(orderingFunc);
                        Expression<Func<M_DanhMuc_MatHang, bool>> fillter_MH = u => u.Ten_DanhMuc.ToLower() == request.Ten_DanhMuc.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var checkDm = await _danhMucRepository.GetFirstOrDefaultAsync(fillter_MH);
                        if (checkDm != null)
                        {
                            _danhMucRepository.CommitTransactionAsync();
                            return -1;
                        }

                        danhMuc.Ma_DanhMuc = maxId == null ? 1 : maxId.Ma_DanhMuc + 1;
                        await _danhMucRepository.AddAsync(danhMuc);
                        _logger.LogInformation($"Danh Muc {Unit.Value} is successfully created.");
                    }
                    _danhMucRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _danhMucRepository.RollbackTransactionAsync();
                    return -1;
                    throw;
                }
            }
        }
    }
}
