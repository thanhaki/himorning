using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.PhieuNhapXuat.Queries
{
    public class GetAllProductQuery
    {
        public class ProductQuery : IRequest<List<MatHangNhapXuatModelResponse>>
        {
            public int DonVi { get; set; }
            //public string NameProduct { get; set; }
        }
        public class Handler : IRequestHandler<ProductQuery, List<MatHangNhapXuatModelResponse>>
        {
            private readonly IPhieuNhapXuatRepository _phieuNhapXuatRepository;
            private readonly IMapper _mapper;

            public Handler(IPhieuNhapXuatRepository phieuNhapXuatRepository, IMapper mapper)
            {
                _phieuNhapXuatRepository = phieuNhapXuatRepository ?? throw new ArgumentNullException(nameof(phieuNhapXuatRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<MatHangNhapXuatModelResponse>> Handle(ProductQuery request, CancellationToken cancellationToken)
            {
                var query = await _phieuNhapXuatRepository.GetAllProduct(request);
                return query.OrderByDescending(x => x.Id).ToList();

            }
        }
    }
}

