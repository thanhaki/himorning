using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.PostBill.Queries
{
    public class GetAllUserByDonViQuery
    {
        public class QueryUserDv : IRequest<List<UserModelResponse>>
        {
            public int DonVi { get; set; }
            public QueryUserDv(int id)
            {
                DonVi = id;
            }
        }
        public class Handler : IRequestHandler<QueryUserDv, List<UserModelResponse>>
        {
            private readonly IUserRepository _userRepository;
            private readonly IMapper _mapper;

            public Handler(IMapper mapper, IUserRepository userRepository)
            {
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _userRepository = userRepository;
            }

            public async Task<List<UserModelResponse>> Handle(QueryUserDv request, CancellationToken cancellationToken)
            {
                Expression<Func<M_User, bool>> expression = x => x.DonVi == request.DonVi && x.Deleted == 0;
                var data = await _userRepository.GetAsync(expression, null);
                return _mapper.Map<List<UserModelResponse>>(data);
            }
        }
    }
}
