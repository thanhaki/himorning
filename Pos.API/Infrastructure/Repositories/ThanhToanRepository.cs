using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;

namespace Pos.API.Infrastructure.Repositories
{
    public class ThanhToanRepository : RepositoryBase<T_ThanhToan>, IThanhToanRepository
    {

        public ThanhToanRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
    }
}
