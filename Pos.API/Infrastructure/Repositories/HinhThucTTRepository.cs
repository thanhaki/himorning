using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;

namespace Pos.API.Infrastructure.Repositories
{
    public class HinhThucTTRepository : RepositoryBase<M_HinhThucThanhToan>, IHinhThucTTRepository
    {

        public HinhThucTTRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
    }
}
