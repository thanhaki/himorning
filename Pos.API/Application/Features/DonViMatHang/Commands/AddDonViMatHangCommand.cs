using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Application.Features.DanhMuc.Commands;
using Pos.API.Application.Features.MatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DonViMatHang.Commands
{
    public class AddDonViMatHangCommand
    {
        public class AddDonViMatHangRequest : IRequest<int>
        {
            public string Ten_DonVi { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddDonViMatHangRequest,int>
        {
            private readonly IDonViMathangRepository _DonViMatHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddDonViMatHangCommand> _logger;
            public Handler(IDonViMathangRepository DonVimatHangRepository, IMapper mapper, ILogger<AddDonViMatHangCommand> logger)
            {
                _DonViMatHangRepository = DonVimatHangRepository ?? throw new ArgumentNullException(nameof(DonVimatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(AddDonViMatHangRequest request, CancellationToken cancellationToken)
            {
                var dv_MatHang = _mapper.Map<M_DonVi_MatHang>(request);
                if (dv_MatHang != null)
                {
                    Func<IQueryable<M_DonVi_MatHang>, IOrderedQueryable<M_DonVi_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.Ma_DonVi);
                    var maxId = await _DonViMatHangRepository.GetMaxIdAsync(orderingFunc);
                    Expression<Func<M_DonVi_MatHang, bool>> fillter = u => u.Ten_DonVi.ToLower() == request.Ten_DonVi.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                    var checkDm = await _DonViMatHangRepository.GetFirstOrDefaultAsync(fillter);
                    if (checkDm != null) return -1;
                    dv_MatHang.Ma_DonVi = maxId == null ? 1 : maxId.Ma_DonVi + 1;
                    await _DonViMatHangRepository.AddAsync(dv_MatHang);
                    _logger.LogInformation($"Don Vi Mat Hang {Unit.Value} is successfully created.");
                }
                return 1;
            }
        }
    }
}
