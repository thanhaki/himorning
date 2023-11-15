using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.TheThanhVien.Queries
{
    public class GetKhachHangByIdThe
    {
        public class GetKhachHangByIdQuery : IRequest<List<TheThanhVienModelResponse>>
        {
            public int Ma_TTV { get; set; }
            public int DonVi { get; set; }
        }

        public class Handler : IRequestHandler<GetKhachHangByIdQuery, List<TheThanhVienModelResponse>>
        {
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly IMapper _mapper;

            public Handler(ITheThanhVienRepository theThanhVienRepository, IMapper mapper)
            {
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<TheThanhVienModelResponse>> Handle(GetKhachHangByIdQuery request, CancellationToken cancellationToken)
            {
                var List = await _theThanhVienRepository.GetAllKhachHangByIdThe(request);
                return List.ToList();
            }
        }
    }
}