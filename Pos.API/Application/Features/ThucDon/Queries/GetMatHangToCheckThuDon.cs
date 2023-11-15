using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.ThucDon.Queries
{
    public class GetMatHangToCheckThucDon
    {
        public class GetMatHangToCheck : IRequest<List<ThucDonMatHangIsCheckModelResponse>>
        {
            public int DonVi { get; set; }
            public int? Ma_TD { get; set; }
            public string? NameProduct { get; set; }
            public int danhMuc { get; set; }
        }
        public class Handler : IRequestHandler<GetMatHangToCheck, List<ThucDonMatHangIsCheckModelResponse>>
        {
            private readonly IThucDonMatHangRepository _thuDonMatHangRepository;
            private readonly IDanhMucMHRepository _danhMucRepository;
            private readonly IMapper _mapper;

            public Handler(IDanhMucMHRepository DanhMucRepository, IThucDonMatHangRepository thucDonMatHangRepository, IMapper mapper)
            {
                _thuDonMatHangRepository = thucDonMatHangRepository ?? throw new ArgumentNullException(nameof(thucDonMatHangRepository));
                _danhMucRepository = DanhMucRepository ?? throw new ArgumentNullException(nameof(DanhMucRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<ThucDonMatHangIsCheckModelResponse>> Handle(GetMatHangToCheck request, CancellationToken cancellationToken)
            {
                var query = await _thuDonMatHangRepository.GetMatHangToCheckThucDon(request);
                return query.OrderByDescending(x => x.Ma_MH).ToList();

            }
        }
    }
}
