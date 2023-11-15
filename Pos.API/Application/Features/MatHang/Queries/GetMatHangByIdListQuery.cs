using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace User.API.Application.Features.MatHang.Queries
{

    public class GetMatHangByIdListQuery
    {
        public class MatHangDVQuery : IRequest<List<MatHangModelRespose>>
        {
            public int Ma_DonVi { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<MatHangDVQuery, List<MatHangModelRespose>>
        {
            private readonly IMatHangRepository _MatHangRepository;
            private readonly IDonViMathangRepository _donViRepository;
            private readonly IMapper _mapper;

            public Handler(IDonViMathangRepository DonViRepository, IMatHangRepository MatHangRepository, IMapper mapper)
            {
                _MatHangRepository = MatHangRepository ?? throw new ArgumentNullException(nameof(MatHangRepository));
                _donViRepository = DonViRepository ?? throw new ArgumentNullException(nameof(DonViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<MatHangModelRespose>> Handle(MatHangDVQuery request, CancellationToken cancellationToken)
            {
                var MatHangList = await _MatHangRepository.GetMatHangByIdListQuery(request.Ma_DonVi, request.DonVi);
                return MatHangList.ToList();
            }
        }
    }
}
