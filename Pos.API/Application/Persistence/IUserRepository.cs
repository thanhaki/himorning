using Pos.API.Domain.Entities;
using Pos.API.Models;

namespace Pos.API.Application.Persistence
{
    public interface IUserRepository : IAsyncRepository<M_User>
    {
        Task<M_User> GetUserByUserName(string userName);
        Task<UserModelResponse> GetInforUser(M_User user);
    }
}
