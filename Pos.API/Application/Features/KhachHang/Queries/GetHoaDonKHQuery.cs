using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.KhachHang.Queries
{
    public class GetHoaDonKHQuery
    {
        public class HoaDonKHQuery : IRequest<List<HoaDonKHModelResponse>>
        {
            public int DonVi { get; set; }
            public int Ma_KH { get; set; }
            public HoaDonKHQuery(int id, int maKh)
            {
                DonVi = id;
                Ma_KH = maKh;
            }
        }

        public class Handler : IRequestHandler<HoaDonKHQuery, List<HoaDonKHModelResponse>>
        {
            private readonly IDonHangRepository _hoaDonKhRepository;
            private readonly IMapper _mapper;

            public Handler(IDonHangRepository hoaDonKhRepository, IMapper mapper)
            {
                _hoaDonKhRepository = hoaDonKhRepository ?? throw new ArgumentNullException(nameof(hoaDonKhRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<HoaDonKHModelResponse>> Handle(HoaDonKHQuery request, CancellationToken cancellationToken)
            {
                var lisHoaDonKh = await _hoaDonKhRepository.GetHoaDonKhachHang(request.DonVi, request.Ma_KH);
                return lisHoaDonKh.ToList();
            }
        }
    }
}
