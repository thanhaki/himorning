using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.NhomKhachHang.Queries
{
    public class GetAllNhomkhachHangQuery
    {
        public class NhomkhachHangQuery : IRequest<List<NhomKhachHangModelResponse>>
        {
            public int DonVi { get; set; }
            public NhomkhachHangQuery(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<NhomkhachHangQuery, List<NhomKhachHangModelResponse>>
        {
            private readonly INhomKhachHangRepository _nhomKhachHangRepository;
            private readonly IMapper _mapper;

            public Handler(INhomKhachHangRepository nhomKhachHangRepository, IMapper mapper)
            {
                _nhomKhachHangRepository = nhomKhachHangRepository ?? throw new ArgumentNullException(nameof(nhomKhachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<NhomKhachHangModelResponse>> Handle(NhomkhachHangQuery request, CancellationToken cancellationToken)
            {
                var listNhomKhachHang = await _nhomKhachHangRepository.GetAllNhomKhachHang(request.DonVi);
                return listNhomKhachHang.ToList();
            }
        }
    }
}
