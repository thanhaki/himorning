using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Features.PhieuNhapXuat.Queries
{
    public class GetAllProductKiemKe
    {
        public class ProductById : IRequest<List<MatHangNhapXuatModelResponse>>
        {
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<ProductById, List<MatHangNhapXuatModelResponse>>
        {
            private readonly IPhieuNhapXuatRepository _phieuNhapXuatRepository;
            private readonly IMapper _mapper;

            public Handler(IPhieuNhapXuatRepository phieuNhapXuatRepository, IMapper mapper)
            {
                _phieuNhapXuatRepository = phieuNhapXuatRepository ?? throw new ArgumentNullException(nameof(phieuNhapXuatRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<MatHangNhapXuatModelResponse>> Handle(ProductById request, CancellationToken cancellationToken)
            {
                var query = await _phieuNhapXuatRepository.GetAllProductKiemKe(request.DonVi);
                return query.OrderByDescending(x => x.Id).ToList();

            }
        }
    }
}

