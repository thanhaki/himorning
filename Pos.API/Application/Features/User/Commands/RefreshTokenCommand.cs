using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.VerifyCode.Commands
{
    public class RefreshTokenCommand
    {
        public class TokenApiRequest: IRequest<AuthenticatedResponse>
        {
            public string? AccessToken { get; set; }
            public string? RefreshToken { get; set; }
        }
        public class Handler : IRequestHandler<TokenApiRequest, AuthenticatedResponse>
        {
            private readonly IVerifyCodeRepository _verifyCodeRepository;
            private readonly IUserRepository _userRepository;
            private readonly IRefreshTokenRepository _refreshToken;
            private readonly IMapper _mapper;

            public Handler(
                IVerifyCodeRepository verifyCodeRepository,
                IMapper mapper, 
                IUserRepository userRepository,
                IRefreshTokenRepository refreshToken)
            {
                _verifyCodeRepository = verifyCodeRepository ?? throw new ArgumentNullException(nameof(verifyCodeRepository));
                _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _refreshToken = refreshToken;
            }

            public async Task<AuthenticatedResponse> Handle(TokenApiRequest request, CancellationToken cancellationToken)
            {
                string accessToken = request.AccessToken;
                string refreshToken = request.RefreshToken;

                var principal = TokenRequestHandler.GetPrincipalFromExpiredToken(accessToken);
                var username = principal.Identity.Name;
                
                Expression<Func<M_User, bool>> filterUser = u => u.Phone == username && u.Deleted == 0;
                var userLogin = await _userRepository.GetFirstOrDefaultAsync(filterUser);

                Expression<Func<T_TokenInfo, bool>> predicate = tk => tk.UserName == username;
                var userToken = await _refreshToken.GetFirstOrDefaultAsync(predicate);

                if (userToken is null || userToken.RefreshToken != refreshToken || userToken.RefreshTokenExpiryTime <= DateTime.Now)
                {
                    return new AuthenticatedResponse()
                    {
                        Token = "",
                        RefreshToken = "",
                        Message = "Invalid client request"
                    };
                }
                var newAccessToken = TokenRequestHandler.GenerateAccessToken(userLogin);
                var newRefreshToken = TokenRequestHandler.GenerateRefreshToken();
                userToken.RefreshToken = newRefreshToken;
                await _refreshToken.UpdateAsync(userToken);
                return new AuthenticatedResponse()
                {
                    Token = newAccessToken,
                    RefreshToken = newRefreshToken,
                    User = _mapper.Map<UserModelResponse>(userLogin)
                };
            }

        }
    }
}
