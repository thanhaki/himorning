using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.VerifyCode.Commands
{
    public class ForgetPasswordCommand
    {
        public class UpdatePasswordRequest : IRequest<int>
        {
            public string Email { get; set; }
            public string CodeVerify { get; set; }
            public string Password { get; set; }
            public string PasswordNew { get; set; }
        }
        public class Handler : IRequestHandler<UpdatePasswordRequest, int>
        {
            private readonly IVerifyCodeRepository _verifyCodeRepository;
            private readonly IUserRepository _userRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateVerifyCodeCommand> _logger;
            private readonly IEmailService _emailService;

            public Handler(
                IVerifyCodeRepository verifyCodeRepository,
                IMapper mapper, 
                ILogger<UpdateVerifyCodeCommand> logger,
                IUserRepository userRepository,
                IEmailService emailService)
            {
                _verifyCodeRepository = verifyCodeRepository ?? throw new ArgumentNullException(nameof(verifyCodeRepository));
                _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _emailService = emailService;
            }

            public async Task<int> Handle(UpdatePasswordRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<T_VerifyCode, bool>> filterCode = s => s.CodeVerify == request.CodeVerify &&
                                                               s.DateActivate == null
                                                               && s.DateRequest.AddSeconds(Utilities.GetInt("TimeToLiveCodeVerify")) > DateTime.Now;

                var verifyCode = await _verifyCodeRepository.GetFirstOrDefaultAsync(filterCode);

                if (verifyCode == null) return -1;

                Expression<Func<M_User, bool>> predicate = u => u.Email == request.Email && verifyCode.DonVi == u.DonVi && u.Deleted == 0;
                var user = await _userRepository.GetFirstOrDefaultAsync(predicate);

                if (user == null)
                    return 0;

                user.Password = Utilities.Encrypt(request.Password);
                await _userRepository.UpdateAsync(user);
                
                verifyCode.DateActivate = Utilities.GetDateTimeSystem();
                await _verifyCodeRepository.UpdateAsync(verifyCode);


                _logger.LogInformation($"New code is successfully created.");
                return 1;
            }

        }
    }
}
