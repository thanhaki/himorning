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
    public class GetLogin
    {
        public class Query : IRequest<AuthenticatedResponse>
        {
            public string PhoneNumber { set; get; }
            public string Password { set; get; }
        }

        public class Handler : IRequestHandler<Query, AuthenticatedResponse>
        {
            private readonly IUserRepository _userRepository;
            private readonly IVerifyCodeRepository _verifyCodeRepository; 
            private readonly IRefreshTokenRepository _refreshToken; 
            private readonly IDonViRepository _donViRepository; 
            private readonly IMapper _mapper;
            private readonly ILogger<GetLogin> _logger;
            private readonly INhomQuyenChucNangRepository _nhomQuyenChucNangRepository;

            public Handler(IUserRepository userRepository, 
                IMapper mapper, 
                IVerifyCodeRepository verifyCodeRepository, 
                IRefreshTokenRepository refreshToken, 
                IDonViRepository donViRepository,
                ILogger<GetLogin> logger, INhomQuyenChucNangRepository nhomQuyenChucNangRepository)
            {
                _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
                _verifyCodeRepository = verifyCodeRepository ?? throw new ArgumentNullException(nameof(verifyCodeRepository));
                _nhomQuyenChucNangRepository = nhomQuyenChucNangRepository ?? throw new ArgumentNullException(nameof(nhomQuyenChucNangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _refreshToken = refreshToken;
                _donViRepository = donViRepository;
                _logger = logger;
            }

            public async Task<AuthenticatedResponse> Handle(Query request, CancellationToken cancellationToken)
            {
                _logger.LogInformation($"Start to login");
                Expression<Func<M_User, bool>> predicate = u => (u.Phone == request.PhoneNumber || u.UserName.ToLower() == request.PhoneNumber.ToLower()) && u.Deleted == 0;
                var user =  await _userRepository.GetFirstOrDefaultAsync(predicate);
                var passWord = string.Empty;
                
                passWord = Utilities.Encrypt(request.Password);

                if (user != null && user.Password == passWord)
                {
                    Expression<Func<T_VerifyCode, bool>> filterCode = code => code.DonVi == user.DonVi && code.DateActivate != null;
                    var isVerified = await _verifyCodeRepository.GetFirstOrDefaultAsync(filterCode);
                    if (isVerified !=null)
                    {
                        Expression<Func<T_TokenInfo, bool>> getToken = tk => tk.UserName == user.UserName;

                        T_TokenInfo tokenInfo = await _refreshToken.GetFirstOrDefaultAsync(getToken);

                        var accessToken = TokenRequestHandler.GenerateAccessToken(user);
                        var refreshToken = TokenRequestHandler.GenerateRefreshToken();
                        if (tokenInfo == null)
                        {
                            tokenInfo = new T_TokenInfo();
                            tokenInfo.Password = user.Password;
                            tokenInfo.UserName = user.UserName;
                            tokenInfo.DonVi = user.DonVi;
                            tokenInfo.RefreshToken = refreshToken;
                            tokenInfo.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
                            await _refreshToken.AddAsync(tokenInfo);

                        } else
                        {

                            tokenInfo.RefreshToken = refreshToken;
                            tokenInfo.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
                            await _refreshToken.UpdateAsync(tokenInfo);
                        }

                        var userResponse = await _userRepository.GetInforUser(user);
                        _logger.LogInformation($"Login Successfully");
                        return new AuthenticatedResponse
                        {
                            Token = accessToken,
                            RefreshToken = refreshToken,
                            User = userResponse
                        };
                    }
                }
                return new AuthenticatedResponse
                {
                    Token = "",
                    RefreshToken = "",
                    Message = "Số điện thoại/Mật khẩu không đúng"
                };
            }
        }
    }
}
