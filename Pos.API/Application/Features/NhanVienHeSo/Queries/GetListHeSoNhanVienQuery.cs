using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.NhanVienHeSo.Queries
{
    public class GetListHeSoNhanVienQuery
    {
        public class HeSoNhanVien : IRequest<List<NhanVienHeSoModelResponse>>
        {
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<HeSoNhanVien, List<NhanVienHeSoModelResponse>>
        {
            private readonly INhanVienHeSoRepository _nhanVienHeSoRepository;
            private readonly IMapper _mapper;

            public Handler(INhanVienHeSoRepository nhanVienHeSoRepository, IMapper mapper)
            {
                _nhanVienHeSoRepository = nhanVienHeSoRepository ?? throw new ArgumentNullException(nameof(nhanVienHeSoRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<NhanVienHeSoModelResponse>> Handle(HeSoNhanVien request, CancellationToken cancellationToken)
            {
                var listNhanVienHS = await _nhanVienHeSoRepository.GetAllHeSoNhanVien(request);
                return listNhanVienHS.ToList();
            }
        }
    }
}
