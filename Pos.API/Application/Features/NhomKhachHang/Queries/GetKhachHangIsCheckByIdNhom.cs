using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.NhomKhachHang.Queries
{
    public class GetKhachHangIsCheckByIdNhom
    {
        public class GetKhachHangToCheck : IRequest<List<NhomKhachHangModelResponse>>
        {
            public int DonVi { get; set; }
            public int Ma_NKH { get; set; }
            public string? Name { get; set; }
        }
        public class Handler : IRequestHandler<GetKhachHangToCheck, List<NhomKhachHangModelResponse>>
        {
            private readonly INhomKhachHangRepository _nhomKhachHangRepository;
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;

            public Handler(INhomKhachHangRepository nhomKhachHangRepository, IKhachHangRepository khachHangRepository, IMapper mapper)
            {
                _nhomKhachHangRepository = nhomKhachHangRepository ?? throw new ArgumentNullException(nameof(nhomKhachHangRepository));
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<NhomKhachHangModelResponse>> Handle(GetKhachHangToCheck request, CancellationToken cancellationToken)
            {
                var query = await _nhomKhachHangRepository.GetKhachHangIsCheckByIdNhom(request);
                return query.OrderByDescending(x => x.Ma_KH).ToList();

            }
        }
    }
}
