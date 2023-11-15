using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.DanhMucThuChi.Queries
{
    public class GetDanhMucThuChiListQuery
    {
        public class GetDanhMucThuChiQuery : IRequest<List<DanhMucThuChiModelResponse>>
        {
            public int Loai_DanhMucThuChi { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<GetDanhMucThuChiQuery, List<DanhMucThuChiModelResponse>>
        {
            private readonly IDanhMucThuChiRepository _DanhMucThuChiRepository;
            private readonly IMapper _mapper;

            public Handler(IDanhMucThuChiRepository danhMucThuChiRepository, IMapper mapper)
            {
                _DanhMucThuChiRepository = danhMucThuChiRepository ?? throw new ArgumentNullException(nameof(danhMucThuChiRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<DanhMucThuChiModelResponse>> Handle(GetDanhMucThuChiQuery request, CancellationToken cancellationToken)
            {
                var danhmucthuchi = await _DanhMucThuChiRepository.GetAllDataDanhMucThuChi(request.DonVi, request.Loai_DanhMucThuChi);
                return danhmucthuchi.ToList();
            }
        }
    }
}
