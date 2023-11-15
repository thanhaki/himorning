using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.KhachHang.Queries
{
    public class GetLichSuTDKHQuery
    {
        public class LichSuTDKHQuery : IRequest<List<LichSuTichDiemKhModelResponse>>
        {
            public int DonVi { get; set; }
            public int Ma_KH { get; set; }
            public LichSuTDKHQuery(int id, int maKh)
            {
                DonVi = id;
                Ma_KH = maKh;
            }
        }

        public class Handler : IRequestHandler<LichSuTDKHQuery, List<LichSuTichDiemKhModelResponse>>
        {
            private readonly ILichSuTichDiemKHRepository _lichSuTDKhRepository;
            private readonly IMapper _mapper;

            public Handler(ILichSuTichDiemKHRepository lichSuTDKhRepository, IMapper mapper)
            {
                _lichSuTDKhRepository = lichSuTDKhRepository ?? throw new ArgumentNullException(nameof(lichSuTDKhRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<LichSuTichDiemKhModelResponse>> Handle(LichSuTDKHQuery request, CancellationToken cancellationToken)
            {
                var listTichDiem = await _lichSuTDKhRepository.GetLichSuTichDiemKH(request.DonVi, request.Ma_KH);
                return listTichDiem.ToList();
            }
        }
    }
}
