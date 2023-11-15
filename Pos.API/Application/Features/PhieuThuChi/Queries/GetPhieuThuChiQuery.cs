using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.PhieuThuChi.Queries
{
    public class GetPhieuThuChiListQuery
    {
        public class GetPhieuThuChiQuery : IRequest<List<PhieuThuChiModalRespose>>
        {
            public int Loai_DanhMucThuChi { get; set; }
            public int DonVi { get; set; }
            public int[] DanhMucThuChi { get; set; }
            public ThoiGianFilter? ThoiGian { set; get; }
        }

        public class Handler : IRequestHandler<GetPhieuThuChiQuery, List<PhieuThuChiModalRespose>>
        {
            private readonly IPhieuThuChiRepository _phieuThuChiRepository;
            private readonly IMapper _mapper;

            public Handler(IPhieuThuChiRepository phieuThuChiRepository, IMapper mapper)
            {
                _phieuThuChiRepository = phieuThuChiRepository ?? throw new ArgumentNullException(nameof(phieuThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<PhieuThuChiModalRespose>> Handle(GetPhieuThuChiQuery request, CancellationToken cancellationToken)
            {
                var phieuthuchi = await _phieuThuChiRepository.GetAllPhieuThuChi(request.DonVi, request.Loai_DanhMucThuChi, request.DanhMucThuChi, request.ThoiGian);
                return phieuthuchi.ToList();
            }
        }
    }
}
