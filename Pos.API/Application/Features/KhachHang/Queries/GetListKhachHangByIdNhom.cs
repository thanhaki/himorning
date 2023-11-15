using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.KhachHang.Queries
{
    public class GetListKhachHangByIdNhom
    {
        public class KhachHangQueryById : IRequest<List<KhachHangModelResponse>>
        {
            public int DonVi { get; set; }
            public int Ma_NKH { get; set; }
        }

        public class Handler : IRequestHandler<KhachHangQueryById, List<KhachHangModelResponse>>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;

            public Handler(IKhachHangRepository khachHangRepository, IMapper mapper)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<KhachHangModelResponse>> Handle(KhachHangQueryById request, CancellationToken cancellationToken)
            {
                var listNhomKhachHang = await _khachHangRepository.GetListKhachHangByIdNhom(request.DonVi, request.Ma_NKH);
                return listNhomKhachHang.ToList();
            }
        }
    }
}
