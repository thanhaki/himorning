using System.Linq.Expressions;
using System.Security.Claims;
using MailKit.Search;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Common;
using Pos.API.Infrastructure.Persistence;

namespace Pos.API.Infrastructure.Repositories
{
    public class RepositoryBase<T> : IAsyncRepository<T> where T : EntityBase
    {
        private readonly IHttpContextAccessor _context;
        protected readonly DBPosContext _dbContext;

        public RepositoryBase(DBPosContext dbContext, IHttpContextAccessor context)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public string GetUser()
        {
            var username = _context.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's DonVi
            return username;
        }

        public string GetDonvi()
        {
            var dv = _context.HttpContext.User?.FindFirstValue(ClaimTypes.PrimaryGroupSid); // will give the user's DonVi
            return dv;
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>>? predicate = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string? includeString = null, bool disableTracking = true)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            if (disableTracking) query = query.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(includeString)) query = query.Include(includeString);

            if (predicate != null) query = query.Where(predicate);

            if (orderBy != null)
                return await orderBy(query).ToListAsync();
            return await query.ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAsyncInclude(Expression<Func<T, bool>> predicate = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<Expression<Func<T, object>>> includes = null, bool disableTracking = true)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            if (disableTracking) query = query.AsNoTracking();

            if (includes != null) query = includes.Aggregate(query, (current, include) => current.Include(include));

            if (predicate != null) query = query.Where(predicate);

            if (orderBy != null)
                return await orderBy(query).ToListAsync();
            return await query.ToListAsync();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public async Task<T> AddAsync(T entity)
        {
            string user = GetUser();
            entity.CreateDate = Utilities.GetDateTimeSystem();
            entity.CreateBy = user + "";
            _dbContext.Set<T>().Add(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(T entity)
        {
            string user = GetUser();
            entity.UpdateDate = Utilities.GetDateTimeSystem();
            entity.UpdateBy = user;
            if (entity.Deleted == 1)
            {
                entity.DeleteDate = Utilities.GetDateTimeSystem();
                entity.DeleteBy = user;
            }
            _dbContext.Entry(entity).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(List<T> entities)
        {
            string user = GetUser();
            foreach (var en in entities)
            {
                en.UpdateDate = Utilities.GetDateTimeSystem();
                en.UpdateBy = user;
                if (en.Deleted == 1)
                {
                    en.DeleteDate = Utilities.GetDateTimeSystem();
                    en.DeleteBy = user;
                }
            }
            _dbContext.UpdateRange(entities);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<T> GetMaxIdAsync(Func<IQueryable<T>, IOrderedQueryable<T>> orderBy)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            return await orderBy(query).FirstOrDefaultAsync();
        }

        public async Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).FirstOrDefaultAsync();
        }

        public void BeginTransactionAsync()
        {
            _dbContext.Database.BeginTransactionAsync();
        }

        public void CommitTransactionAsync()
        {
            _dbContext.Database.CommitTransactionAsync();
        }

        public void RollbackTransactionAsync()
        {
            _dbContext.Database.RollbackTransactionAsync();
        }

        public async Task AddRangeAsync(List<T> entities)
        {
            string user = GetUser();
            foreach (var en in entities)
            {
                en.CreateDate = Utilities.GetDateTimeSystem();
                en.CreateBy = user;
            }
            await _dbContext.Set<T>().AddRangeAsync(entities);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteRangeAsync(List<T> entity)
        {
            _dbContext.Set<T>().RemoveRange(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<T>> GetListAsyncToUpdate(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).ToListAsync();
        }
    }
}
