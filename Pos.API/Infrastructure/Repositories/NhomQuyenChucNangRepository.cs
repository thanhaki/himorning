using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;

namespace Pos.API.Infrastructure.Repositories
{
    public class NhomQuyenChucNangRepository : RepositoryBase<M_NhomQuyen_ChucNang>, INhomQuyenChucNangRepository
    {
        public NhomQuyenChucNangRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
    }
}
