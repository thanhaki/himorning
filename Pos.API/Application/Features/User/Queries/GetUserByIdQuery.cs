using AutoMapper;
using Azure.Core;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;

namespace Pos.API.Application.Features.User.Queries
{
    public class GetUserByIdQuery
    {
        public class QueryById : IRequest<UserModelResponse>
        {
            public int No_User { set; get; }
            public int? DonVi { set; get; }
        }

        public class Handler : IRequestHandler<QueryById, UserModelResponse>
        {
            private readonly IUserRepository _userRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly INhomQuyenChucNangRepository _nhomQuyenChucNangRepository;
            private readonly IMapper _mapper;


            public Handler(IUserRepository userRepository, 
                IMapper mapper, 
                IDonViRepository donViRepository, INhomQuyenChucNangRepository nhomQuyenChucNangRepository)
            {
                _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
                _nhomQuyenChucNangRepository = nhomQuyenChucNangRepository ?? throw new ArgumentNullException(nameof(nhomQuyenChucNangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _donViRepository = donViRepository;
            }

            public async Task<UserModelResponse> Handle(QueryById request, CancellationToken cancellationToken)
            {
                Expression<Func<M_User, bool>> predicate = u => u.No_User == request.No_User && u.Deleted == 0;
                var user =  await _userRepository.GetFirstOrDefaultAsync(predicate);
                
                if (user != null)
                {
                    var userResponse = await _userRepository.GetInforUser(user);

                    return userResponse;
                }
                return new UserModelResponse();
            }
        }
    }
}
