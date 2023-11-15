using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.LuongNhanVien.Queries
{
    public class GetLuongNhanVienByIdQueries
    {
        public class QueryBydId : IRequest<List<LuongNhanVienModelResponse>>
        {
            public int DonVi { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public int? So_NV { get; set; }
            public int? Status  { get; set; }
        }
        public class Handler : IRequestHandler<QueryBydId, List<LuongNhanVienModelResponse>>
        {
            private readonly ILuongNhanVienRepository _luongNhanVienRepository;
            private readonly IMapper _mapper;

            public Handler(ILuongNhanVienRepository luongNhanVienRepository, IMapper mapper)
            {
                _luongNhanVienRepository = luongNhanVienRepository ?? throw new ArgumentNullException(nameof(luongNhanVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<LuongNhanVienModelResponse>> Handle(QueryBydId request, CancellationToken cancellationToken)
            {
                var list = await _luongNhanVienRepository.LuongNhanVienById(request);
                return list.ToList();
            }
        }
    }
}
