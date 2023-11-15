using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;

namespace Pos.API.Infrastructure.Repositories
{
    public class MDataRepository : RepositoryBase<M_Data>, IMDataRepository
    {

        public MDataRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }

        public async Task<IEnumerable<M_Data>> GetDataByGroupdata(string groupData)
        {
            var result = await _dbContext.M_Data.Where(x=>x.GroupData == groupData && x.Deleted == 0 && !x.isLock).ToListAsync();
            return result;
        }
    }
}
