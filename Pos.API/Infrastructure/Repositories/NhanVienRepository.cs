using AutoMapper;
using Pos.API.Application.Features.ThucDon.Queries;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;

namespace Pos.API.Infrastructure.Repositories
{
    public class NhanVienRepository : RepositoryBase<M_User>, INhanVienRepository
    {
        public NhanVienRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {
        }
        public async Task<IEnumerable<NhanVienModelRespose>> GetAllNhanVien(int id)
        {
            var result = (from p in _dbContext.M_User
                         join nq in _dbContext.M_NhomQuyen.Where(x => x.DonVi ==id && x.Deleted == 0) on p.Permistion equals nq.Ma_NhomQuyen into gj
                         from subpet in gj.DefaultIfEmpty()
                         where p.DonVi == id && p.Deleted == 0 && p.IsAdministrator == "0"
                         select new NhanVienModelRespose
                         {
                             Id = p.No_User,
                             No_User = p.No_User,
                             UserName = p.UserName,
                             FullName = p.FullName,
                             DonVi = p.DonVi,
                             Email = p.Email,
                             Phone = p.Phone,
                             PIN = p.PIN,
                             TenNhomQuyen = subpet.TenNhomQuyen,
                             Ma_NhomQuyen = p.Permistion,
                             Password = p.Password,
                         }).OrderByDescending(x => x.No_User).ToList(); 
            return result;
        }
    }
}
