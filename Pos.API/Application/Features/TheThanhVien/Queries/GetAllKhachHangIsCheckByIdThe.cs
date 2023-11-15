using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.TheThanhVien.Queries
{
    public class GetAllKhachHangIsCheckByIdThe
    {
        public class KhachHangToCheck : IRequest<List<TheThanhVienModelResponse>>
        {
            public int DonVi { get; set; }
            public string? Name { get; set; }
        }
        public class Handler : IRequestHandler<KhachHangToCheck, List<TheThanhVienModelResponse>>
        {
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;

            public Handler(ITheThanhVienRepository theThanhVienRepository, IKhachHangRepository khachHangRepository, IMapper mapper)
            {
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<TheThanhVienModelResponse>> Handle(KhachHangToCheck request, CancellationToken cancellationToken)
            {
                var query = await _theThanhVienRepository.GetKhachHangIsCheckByIdThe(request);
                return query.OrderByDescending(x => x.Ma_TTV).ToList();

            }
        }
    }
}
