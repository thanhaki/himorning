using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.KhachHang.Queries
{
    public class GetListKhachHang
    {
        public class KhachHangQuery : IRequest<List<KhachHangModelResponse>>
        {
            public int DonVi { get; set; }
            public int LoaiKH { get; set; }
            public KhachHangQuery(int id, int loaiKH)
            {
                DonVi = id;
                LoaiKH = loaiKH;
            }
        }

        public class Handler : IRequestHandler<KhachHangQuery, List<KhachHangModelResponse>>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;

            public Handler(IKhachHangRepository khachHangRepository, IMapper mapper)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<KhachHangModelResponse>> Handle(KhachHangQuery request, CancellationToken cancellationToken)
            {
                var lisKhachHang = await _khachHangRepository.GetAllKhachHang(request.DonVi, request.LoaiKH);
                return lisKhachHang.ToList();
            }
        }
    }
}
