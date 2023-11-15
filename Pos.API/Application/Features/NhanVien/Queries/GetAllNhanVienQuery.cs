using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.NhanVien.Queries
{
    public class GetAllNhanVienQuery
    {
        public class GetNhanVienQuery : IRequest<List<NhanVienModelRespose>>
        {
            public int DONVI { get; set; }
            public GetNhanVienQuery(int id)
            {
                DONVI = id;
            }
        }

        public class Handler : IRequestHandler<GetNhanVienQuery, List<NhanVienModelRespose>>
        {
            private readonly INhanVienRepository _nhanVienRepository;
            private readonly IMapper _mapper;

            public Handler(INhanVienRepository nhanVienRepository, IMapper mapper)
            {
                _nhanVienRepository = nhanVienRepository ?? throw new ArgumentNullException(nameof(nhanVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<NhanVienModelRespose>> Handle(GetNhanVienQuery request, CancellationToken cancellationToken1)
            {
                var listNhanVien = await _nhanVienRepository.GetAllNhanVien(request.DONVI);
                return listNhanVien.ToList();
            }
        }
    }
}
