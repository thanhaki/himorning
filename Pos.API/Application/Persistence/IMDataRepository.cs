using Microsoft.AspNetCore.Identity;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;
using System.Security;

namespace Pos.API.Application.Persistence
{
    public interface IMDataRepository : IAsyncRepository<M_Data>
    {
        Task<IEnumerable<M_Data>> GetDataByGroupdata(string groupData);

    }
}
