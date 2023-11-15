using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.TheThanhVien.Queries
{
    public class GetListTheThanhVien
    {
        public class TheThanhVienQuery : IRequest<List<TheThanhVienModelResponse>>
        {
            public int DonVi { get; set; }
            public TheThanhVienQuery(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<TheThanhVienQuery, List<TheThanhVienModelResponse>>
        {
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly IMapper _mapper;

            public Handler(ITheThanhVienRepository theThanhVienRepository, IMapper mapper)
            {
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<TheThanhVienModelResponse>> Handle(TheThanhVienQuery request, CancellationToken cancellationToken)
            {
                var lisTheTv = await _theThanhVienRepository.GetAllTheThanhVien(request.DonVi);
                return lisTheTv.ToList();
            }
        }
    }
}