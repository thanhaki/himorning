using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.DanhMuc.Queries
{
    public class GetAllProductSearch
    {
        public class ProductSearch : IRequest<List<MatHangModelRespose>>
        {
            public int DonVi { get; set; }
            public int MaDanhMuc { get; set; }
        }
        public class Handler : IRequestHandler<ProductSearch, List<MatHangModelRespose>>
        {
            private readonly IMatHangRepository _MatHangRepository;
            private readonly IMapper _mapper;

            public Handler(IMatHangRepository MatHangRepository, IMapper mapper)
            {
                _MatHangRepository = MatHangRepository ?? throw new ArgumentNullException(nameof(MatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<MatHangModelRespose>> Handle(ProductSearch request, CancellationToken cancellationToken)
            {
                var query = await _MatHangRepository.GetAllProductSearch(request);
                return query.OrderByDescending(x => x.Id).ToList();

            }
        }
    }
}
