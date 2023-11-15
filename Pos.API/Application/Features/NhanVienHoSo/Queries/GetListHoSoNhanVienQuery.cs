using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.NhanVienHeSo.Queries
{
    public class GetListHoSoNhanVienQuery
    {
        public class HoSoNhanVien : IRequest<List<HoSoNhanVienModelResponse>>
        {
            public int DonVi { get; set; }
            public int? PhongBan { get; set; }
            public int? TinhTrang { get; set; }
        }
        public class Handler : IRequestHandler<HoSoNhanVien, List<HoSoNhanVienModelResponse>>
        {
            private readonly INhanVienHoSoRepository _nhanVienRepository;
            private readonly IMapper _mapper;

            public Handler(INhanVienHoSoRepository nhanVienRepository, IMapper mapper)
            {
                _nhanVienRepository = nhanVienRepository ?? throw new ArgumentNullException(nameof(nhanVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<HoSoNhanVienModelResponse>> Handle(HoSoNhanVien request, CancellationToken cancellationToken)
            {
                var danhSachPhieu = await _nhanVienRepository.GetAllHoSoNhanVien(request);
                return danhSachPhieu.ToList();
            }
        }
    }
}
