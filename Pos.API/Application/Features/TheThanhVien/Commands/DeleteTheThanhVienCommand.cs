using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.TheThanhVien.Commands
{
    public class DeleteTheThanhVienCommand
    {
        public class DeleteTheThanhVienRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }

        }

        public class Handler : IRequestHandler<DeleteTheThanhVienRequest>
        {
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteTheThanhVienCommand> _logger;
            public Handler(ITheThanhVienRepository theThanhVienRepository, IKhachHangRepository khachHangRepository, IMapper mapper, ILogger<DeleteTheThanhVienCommand> logger)
            {
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(DeleteTheThanhVienRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_TheThanhVien, bool>> getByid = x => x.Deleted == 0 && request.Ids.Contains(x.Ma_TTV) && x.DonVi == request.DonVi;
                var list = await _theThanhVienRepository.GetAsync(getByid);
                foreach (var item in list)
                {
                    item.Deleted = 1;

                    Expression<Func<M_KhachHang, bool>> getLst = x => x.Deleted == 0 && x.Ma_TTV == item.Ma_TTV && x.DonVi == request.DonVi;
                    var lst = await _khachHangRepository.GetAsync(getLst);
                    foreach (var kh in lst)
                    {
                        kh.Ma_TTV = 0;
                        await _khachHangRepository.UpdateAsync(kh);
                    }
                    await _theThanhVienRepository.UpdateAsync(item);
                }
                _logger.LogInformation($"The thanh vien {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}