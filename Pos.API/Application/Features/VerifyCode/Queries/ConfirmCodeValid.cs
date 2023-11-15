using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.VerifyCode.Queries
{
    public class ConfirmCodeValid
    {
        public class QueryCodeVerify : IRequest<T_VerifyCode>
        {
            public string Email { set; get; }
            public string? CodeVerify { set; get; }
        }

        public class Handler : IRequestHandler<QueryCodeVerify, T_VerifyCode>
        {
            private readonly IVerifyCodeRepository _verifyCodeRepository;
            private readonly IUserRepository _userRepository;
            private readonly IMapper _mapper;
            private readonly IEmailService _emailService;

            public Handler(
                IVerifyCodeRepository verifyCodeRepository,
                IMapper mapper,
                IEmailService emailService,
                IUserRepository userRepository)
            {
                _verifyCodeRepository = verifyCodeRepository ?? throw new ArgumentNullException(nameof(verifyCodeRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _emailService = emailService;
                _userRepository = userRepository;
            }

            public async Task<T_VerifyCode> Handle(QueryCodeVerify request, CancellationToken cancellationToken)
            {

                Expression<Func<M_User, bool>> findUserByEmail = u => u.Email == request.Email && u.Deleted == 0;
                var user = await _userRepository.GetFirstOrDefaultAsync(findUserByEmail);
                
                if (user == null) return null;

                Expression<Func<T_VerifyCode, bool>> filterCode = s => s.DonVi == user.DonVi &&
                                                                s.CodeVerify == request.CodeVerify && 
                                                                s.DateActivate == null 
                                                                && s.DateRequest.AddSeconds(Utilities.GetInt("TimeToLiveCodeVerify")) > DateTime.Now;

                var verifyCode = await _verifyCodeRepository.GetFirstOrDefaultAsync(filterCode);

                if (verifyCode != null)
                {
                    SendMailRegisterSuccess(user);
                    verifyCode.DateActivate = Utilities.GetDateTimeSystem();
                    await _verifyCodeRepository.UpdateAsync(verifyCode);
                }

                return verifyCode;
            }

            private void SendMailRegisterSuccess(M_User user)
            {

                string p1 = @"<p>Welcome to Hi Morning Business Account, You have successfully activated the account.";
                string p3 = @"Log in to your account to manage your licenses and add more users.</p>";
                string p4 = @"<p>Sincerely,</p><p>The HiMorningTeam</p>";
                string p2 = string.Format(@"Dear {0},<br /></p> {1} {2} {3}", user.FullName, p1, p3, p4);
                IEnumerable<string> lstEmail = new string[] { user.Email };
                MessageModel messageModel = new MessageModel(lstEmail, "Registration completed", p2);
                _emailService.SendEmail(messageModel);
            }
        }
    }
}
