using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.LichSuCongTacNhanVien.Queries
{
    public class GetLichLamViecNhanVienQueries
    {
        public class LichLamViec : IRequest<List<LichLamViecNhanVienModelResponse>>
        {
            public int DonVi { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
        }
        public class Handler : IRequestHandler<LichLamViec, List<LichLamViecNhanVienModelResponse>>
        {
            private readonly ILichLamViecNVRepository _lichSuCongTacRepository;
            private readonly IMapper _mapper;

            public Handler(ILichLamViecNVRepository lichSuCongTacRepository, IMapper mapper)
            {
                _lichSuCongTacRepository = lichSuCongTacRepository ?? throw new ArgumentNullException(nameof(lichSuCongTacRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<LichLamViecNhanVienModelResponse>> Handle(LichLamViec request, CancellationToken cancellationToken)
            {
                var list = await _lichSuCongTacRepository.GetAllLichLamViecNhanVien(request);
                return list.ToList();
            }
        }
    }
}
