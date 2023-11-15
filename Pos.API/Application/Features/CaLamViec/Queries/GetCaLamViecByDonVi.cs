using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Constans.CmContext;
using System.Linq.Expressions;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Common;

namespace Pos.API.Application.Features.CaLamViec.Queries
{
    public class GetCaLamViecByDonVi
    {
        public class CaLVQuery : IRequest<List<CaLamViecModelResponse>>
        {
            public int DonVi { get; set; }

            public CaLVQuery(int id)
            {
                DonVi = id;
            }
        }

        public class Handler : IRequestHandler<CaLVQuery, List<CaLamViecModelResponse>>
        {
            private readonly ICaLamViecRepository _caLamViecRepository;
            private readonly IMDataRepository _mDataRepository;
            private readonly IMapper _mapper;

            public Handler(ICaLamViecRepository caLamViecRepository, IMapper mapper, IMDataRepository mDataRepository)
            {
                _caLamViecRepository = caLamViecRepository ?? throw new ArgumentNullException(nameof(caLamViecRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _mDataRepository = mDataRepository ?? throw new ArgumentNullException(nameof(mDataRepository));
            }

            public async Task<List<CaLamViecModelResponse>> Handle(CaLVQuery request, CancellationToken cancellationToken)
            {
                var workShift = await _caLamViecRepository.GetAsync(x => x.DonVi == request.DonVi && x.Deleted == 0, null);
                List<CaLamViecModelResponse> list = new List<CaLamViecModelResponse>();
                if (workShift == null || workShift.Count == 0)
                {
                    var htttFromMdata = await _mDataRepository.GetDataByGroupdata(GROUP_DATA.CALAMVIEC.ToDescription());
                    list = _mapper.Map<List<CaLamViecModelResponse>>(htttFromMdata);
                    list.ToList().ForEach(item => item.TinhTrang = 0);
                }
                else
                {
                    list = _mapper.Map<List<CaLamViecModelResponse>>(workShift);
                    list.ToList().ForEach(item => item.TinhTrang = 1);
                }

                return list;
            }
        }
    }
}
