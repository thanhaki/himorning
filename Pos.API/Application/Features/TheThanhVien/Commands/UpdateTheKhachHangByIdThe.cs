using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.TheThanhVien.Commands
{
    public class UpdateTheKhachHangByIdThe
    {
        public class UpdateTheKHByIRequest : IRequest
        {
            public int Ma_TTV { get; set; }
            public int DonVi { get; set; }
            public int[] Ids { get; set; }
        }

        public class Handler : IRequestHandler<UpdateTheKHByIRequest>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateTheKhachHangByIdThe> _logger;
            public Handler(IKhachHangRepository khachHangRepository, IMapper mapper, ILogger<UpdateTheKhachHangByIdThe> logger)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<Unit> Handle(UpdateTheKHByIRequest request, CancellationToken cancellationToken)
            {
                if (request.Ids.Length > 0)
                {
                    foreach (var item in request.Ids)
                    {
                        Expression<Func<M_KhachHang, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_KH == item;

                        var kh = await _khachHangRepository.GetFirstOrDefaultAsync(fillter);
                        if (kh != null)
                        {
                            kh.Ma_TTV = request.Ma_TTV;
                            _mapper.Map(request, kh);
                            await _khachHangRepository.UpdateAsync(kh);
                            _logger.LogInformation($"The Khach Hang {Unit.Value} is successfully updated.");
                        }
                    }
                }
                return Unit.Value;

            }
        }
    }
}
