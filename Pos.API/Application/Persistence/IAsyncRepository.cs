using System.Collections;
using System.Linq.Expressions;
using MailKit.Search;
using Pos.API.Domain.Common;

namespace Pos.API.Application.Persistence
{
    public interface IAsyncRepository<T> where T : EntityBase
    {
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate);
        Task<IEnumerable<T>> GetListAsyncToUpdate(Expression<Func<T, bool>> predicate);
        Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate = null,
                                        Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
                                        string includeString = null,
                                        bool disableTracking = true);
        Task<IReadOnlyList<T>> GetAsyncInclude(Expression<Func<T, bool>> predicate = null,
                                       Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
                                       List<Expression<Func<T, object>>> includes = null,
                                       bool disableTracking = true);
        Task<T> GetByIdAsync(int id);
        Task<T> GetMaxIdAsync(Func<IQueryable<T>, IOrderedQueryable<T>> orderBy);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task UpdateRangeAsync(List<T> entity);
        Task AddRangeAsync(List<T> entity);
        Task DeleteRangeAsync(List<T> entity);
        void BeginTransactionAsync();
        void CommitTransactionAsync();
        void RollbackTransactionAsync();
    }
}
