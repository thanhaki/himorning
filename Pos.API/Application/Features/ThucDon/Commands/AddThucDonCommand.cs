using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DanhMuc.Commands;
using Pos.API.Application.Features.MatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DonViMatHang.Commands
{
    public class AddThucDonCommand
    {
        public class AddThucDonRequest : IRequest<int>
        {
            public string Ten_TD { get; set; }
            public string HinhAnh_TD { get; set; }
            public int? Sort { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddThucDonRequest,int>
        {
            private readonly IThucDonRepository _ThucDonRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddThucDonCommand> _logger;
            public Handler(IThucDonRepository ThucDonRepository, IMapper mapper, ILogger<AddThucDonCommand> logger)
            {
                _ThucDonRepository = ThucDonRepository ?? throw new ArgumentNullException(nameof(DonViMatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(AddThucDonRequest request, CancellationToken cancellationToken)
            {
                var thuDon = _mapper.Map<M_ThucDon>(request);
                if (thuDon != null)
                {
                    Func<IQueryable<M_ThucDon>, IOrderedQueryable<M_ThucDon>> orderingFunc = x => x.OrderByDescending(X => X.Ma_TD);
                    var maxId = await _ThucDonRepository.GetMaxIdAsync(orderingFunc);
                    Expression<Func<M_ThucDon, bool>> fillter = u => u.Ten_TD.ToLower() == request.Ten_TD.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                    var checkDm = await _ThucDonRepository.GetFirstOrDefaultAsync(fillter);
                    if (checkDm != null) return -1;

                    Func<IQueryable<M_ThucDon>, IOrderedQueryable<M_ThucDon>> orderingSort = x => x.Where(x => x.Deleted == 0 && x.DonVi == request.DonVi) 
                    .OrderByDescending(x => x.Sort);
                    var maxSort = await _ThucDonRepository.GetMaxIdAsync(orderingSort);

                    thuDon.Ma_TD = maxId == null ? 1 : maxId.Ma_TD + 1;
                    thuDon.Sort = maxSort == null ? 1 : maxSort.Sort + 1;
                    await _ThucDonRepository.AddAsync(thuDon);
                    _logger.LogInformation($"Thuc Don {Unit.Value} is successfully created.");
                }
                return 1;
            }
        }
    }
}
