using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.TheThanhVien.Commands
{
    public class AddTheThanhVienCommand
    {
        public class AddTheThanhVienRequest : IRequest<int>
        {
            public string Ten_TTV { get; set; }
            public int DiemToiThieu { get; set; }
            public int DiemToiDa { get; set; }
            public decimal TyLeQuyDoi { get; set; }
            public string MieuTa { get; set; }
            public string GhiChu_TTV { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddTheThanhVienRequest, int>
        {
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddTheThanhVienCommand> _logger;
            public Handler(ITheThanhVienRepository theThanhVienRepository, IMapper mapper, ILogger<AddTheThanhVienCommand> logger)
            {
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<int> Handle(AddTheThanhVienRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _theThanhVienRepository.BeginTransactionAsync();
                    var theTv = _mapper.Map<M_TheThanhVien>(request);
                    if (theTv != null)
                    {

                        Func<IQueryable<M_TheThanhVien>, IOrderedQueryable<M_TheThanhVien>> orderingFunc = x => x.OrderByDescending(X => X.Ma_TTV);
                        Expression<Func<M_TheThanhVien, bool>> fillter = u => u.Ten_TTV.ToLower() == request.Ten_TTV.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var check = await _theThanhVienRepository.GetFirstOrDefaultAsync(fillter);
                        var maxId = await _theThanhVienRepository.GetMaxIdAsync(orderingFunc);
                        if (check != null)
                        {
                            _theThanhVienRepository.CommitTransactionAsync();
                            return -1;
                        }
                        theTv.Ma_TTV = maxId == null ? 1 : maxId.Ma_TTV + 1;
                        theTv.DonVi = request.DonVi;
                        await _theThanhVienRepository.AddAsync(theTv);
                        _logger.LogInformation($"The thanh vien {Unit.Value} is successfully created.");
                    }
                    _theThanhVienRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _theThanhVienRepository.RollbackTransactionAsync();
                    throw;
                }

            }
        }
    }
}
