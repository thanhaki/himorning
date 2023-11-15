using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.DonViMatHang.Commands
{
    public class DeleteDonViMatHangCommand
    {
        public class DeleteDonViMatHangRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int? DonVi { get; set; }
        }

        public class Handler : IRequestHandler<DeleteDonViMatHangRequest>
        {
            private readonly IDonViMathangRepository _donViMatHangRepository;
            private readonly ILogger<DeleteDonViMatHangCommand> _logger;

            public Handler(IDonViMathangRepository donViRepository, ILogger<DeleteDonViMatHangCommand> logger)
            {
                _donViMatHangRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _logger = logger;
            }

            public async Task<Unit> Handle(DeleteDonViMatHangRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_DonVi_MatHang, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.Ma_DonVi);
                var listDM = await _donViMatHangRepository.GetAsync(getByid);
                listDM.ToList().ForEach(item => item.Deleted = 1);
                await _donViMatHangRepository.UpdateRangeAsync(listDM.ToList());
				_logger.LogInformation($"Don Vi Mat Hang {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}
