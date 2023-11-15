using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace User.API.Application.Features.MData.Queries
{

    public class GetMDataByGroupNameQuery
    {
        public class RequestGroupData : IRequest<IEnumerable<M_Data>>
        {
            public string GroupName { set; get; }
        }

        public class Handler : IRequestHandler<RequestGroupData, IEnumerable<M_Data>>
        {
            private readonly ISalerRepository _salerRepository;
            private readonly IMDataRepository _mDataRepository;
            private readonly IMapper _mapper;

            public Handler(IMDataRepository mDataRepository, IMapper mapper, ISalerRepository salerRepository)
            {
                _mDataRepository = mDataRepository ?? throw new ArgumentNullException(nameof(mDataRepository));
                _salerRepository = salerRepository ?? throw new ArgumentNullException(nameof(salerRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<IEnumerable<M_Data>> Handle(RequestGroupData request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Data, bool>> getMdata = u => u.Deleted == 0 && !u.isLock && (u.GroupData == request.GroupName);
                var mData = await _mDataRepository.GetAsync(getMdata, null);

                return mData;
            }
        }
    }
}
