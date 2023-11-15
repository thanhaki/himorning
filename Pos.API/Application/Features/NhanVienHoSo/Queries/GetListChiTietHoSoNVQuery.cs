using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.NhanVienHeSo.Queries
{
    public class GetListChiTietHoSoNVQuery
    {
        public class HoSoNhanVienCT : IRequest<List<FileHoSoNhanVienModelResponse>>
        {
            public int DonVi { get; set; }
            public int So_NV { get; set; }
        }
        public class Handler : IRequestHandler<HoSoNhanVienCT, List<FileHoSoNhanVienModelResponse>>
        {
            private readonly INhanVienHoSoRepository _nhanVienHoSoRepository;
            private readonly IMapper _mapper;

            public Handler(INhanVienHoSoRepository nhanVienHoSoRepository, IMapper mapper)
            {
                _nhanVienHoSoRepository = nhanVienHoSoRepository ?? throw new ArgumentNullException(nameof(nhanVienHoSoRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<FileHoSoNhanVienModelResponse>> Handle(HoSoNhanVienCT request, CancellationToken cancellationToken)
            {
                var query = await _nhanVienHoSoRepository.GetChiTietHoSoNV(request);
                return query.OrderByDescending(x => x.Id).ToList();

            }
        }
    }
}
