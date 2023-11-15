using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.LichSuMatHang.Queries
{
    public class GetListDanhSachTonKhoQuery
    {
        public class TonKhoQuery : IRequest<List<TonKhoModelResponse>>
        {
            public int DonVi { get; set; }
            public TonKhoQuery(int id)
            {
                DonVi = id;
            }
        }
        public class Handler : IRequestHandler<TonKhoQuery, List<TonKhoModelResponse>>
        {
            private readonly ILichSuDonHangRepository _lichSuMhRepository;
            private readonly IMapper _mapper;

            public Handler(ILichSuDonHangRepository lichSuMhRepository, IMapper mapper)
            {
                _lichSuMhRepository = lichSuMhRepository ?? throw new ArgumentNullException(nameof(lichSuMhRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<TonKhoModelResponse>> Handle(TonKhoQuery request, CancellationToken cancellationToken)
            {
                var danhSachLs = await _lichSuMhRepository.GetListTonKho(request.DonVi);
                return danhSachLs.ToList();
            }
        }
    }
}
