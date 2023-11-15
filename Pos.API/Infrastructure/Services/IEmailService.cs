

using Pos.API.Models;

namespace Pos.API.Infrastructure.Services
{
    public interface IEmailService
    {
        void SendEmail(MessageModel message);
    }
}
