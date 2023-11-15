using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.KhuyenMai.Queries
{
    public class GetListKhuyenMaiIsCheckDT
    {
        public class GetListDsDTToCheck : IRequest<List<KhuyenMaiIsCheckAdModelResponse>>
        {
            public int DonVi { get; set; }
            public int SelectedValueDT { get; set; }
            public int SoKhuyenMai { get; set; }
        }
        public class Handler : IRequestHandler<GetListDsDTToCheck, List<KhuyenMaiIsCheckAdModelResponse>>
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

            public async Task<List<KhuyenMaiIsCheckAdModelResponse>> Handle(GetListDsDTToCheck request, CancellationToken cancellationToken)
            {

                if (request.SelectedValueDT == 0)
                    return null;
                //list danh sach nhom kh, the tv
                var query = await _khuyenMaiDTRepository.GetListDanhSachKmDtIsCheck(request);
                return query.OrderByDescending(x => x.Ma).ToList();

            }
        }
    }
}
