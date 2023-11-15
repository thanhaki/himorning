using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;
using System.Collections.Generic;

namespace Pos.API.Application.Features.KhuyenMai.Queries
{
    public class GetListKhuyenMaiIsCheckAd
    {
        public class GetListDSToCheck : IRequest<List<KhuyenMaiIsCheckAdModelResponse>>
        {
            public int DonVi { get; set; }
            public int selectedValueAD { get; set; }
            public int SoKhuyenMai { get; set; }
        }
        public class Handler : IRequestHandler<GetListDSToCheck, List<KhuyenMaiIsCheckAdModelResponse>>
        {
            private readonly IKhuyenMaiApDungRepository _khuyenMaiADRepository;
            private readonly IKhuyenMaiDoiTuongRepository _khuyenMaiDTRepository;
            private readonly IMapper _mapper;

            public Handler(IKhuyenMaiApDungRepository khuyenMaiADRepository, IKhuyenMaiDoiTuongRepository khuyenMaiDTRepository, IMapper mapper)
            {
                _khuyenMaiADRepository = khuyenMaiADRepository ?? throw new ArgumentNullException(nameof(khuyenMaiADRepository));
                _khuyenMaiDTRepository = khuyenMaiDTRepository ?? throw new ArgumentNullException(nameof(khuyenMaiDTRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<KhuyenMaiIsCheckAdModelResponse>> Handle(GetListDSToCheck request, CancellationToken cancellationToken)
            {
                
                if (request.selectedValueAD == 0)
                    return null;
                var query = await _khuyenMaiADRepository.GetListDanhSachKmIsCheck(request);
                return query.OrderByDescending(x => x.Ma).ToList();

            }
        }
    }
}
