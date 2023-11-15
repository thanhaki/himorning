using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;
using Pos.API.Models.ElectronicMenu;

namespace Pos.API.Application.Features.ElectronicMenu.Queries
{
    public class GetAllThucDonMatHang
    {
        public class ThucDonQuery : IRequest<DataElectronic>
        {
            public int DonVi { get; set; }
            public ThucDonQuery(int id)
            {
                DonVi = id;
            }
        }
        public class Handler : IRequestHandler<ThucDonQuery, DataElectronic>
        {
            private readonly IMatHangRepository _matHangRepository;
            private readonly IMapper _mapper;

            public Handler(IMatHangRepository matHangRepository, IMapper mapper)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<DataElectronic> Handle(ThucDonQuery request, CancellationToken cancellationToken)
            {
                var listMenus = await _matHangRepository.GetMatHangElectronicMenu(request.DonVi);
                return listMenus;
            }
        }
    }
}
