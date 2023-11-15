using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Services;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.VerifyCode.Commands
{
    public class ChangePasswordCommand
    {
        public class ChangePasswordRequest : IRequest<int>
        {
            public string? UserName { get; set; }
            public string Password { get; set; }
            public string PasswordNew { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<ChangePasswordRequest, int>
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

            public async Task<int> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_User, bool>> predicate = u => u.UserName == request.UserName.ToLower() && u.DonVi == request.DonVi && u.Deleted == 0;
                var user = await _userRepository.GetFirstOrDefaultAsync(predicate);

                var currentPw = Utilities.Encrypt(request.Password);
                if (user == null || user.Password != currentPw)
                    return 0;

                user.Password = Utilities.Encrypt(request.PasswordNew);
                await _userRepository.UpdateAsync(user);

                _logger.LogInformation($"Password update successfully.");
                return 1;
            }

        }
    }
}
