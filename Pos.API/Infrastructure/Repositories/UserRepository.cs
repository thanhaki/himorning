using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Infrastructure.Repositories
{
    public class UserRepository : RepositoryBase<M_User>, IUserRepository
    {
        private readonly IMapper _mapper;
        public UserRepository(DBPosContext dbContext, IMapper mapper, IHttpContextAccessor context) : base(dbContext, context)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<UserModelResponse> GetInforUser(M_User user)
        {
            var userResponse = _mapper.Map<UserModelResponse>(user);

            var donVi = await _dbContext.M_DonVi.FirstOrDefaultAsync(x => x.DonVi == user.DonVi && x.Deleted == 0);

            if (donVi != null)
            {

                // lấy danh sách chức năng
                var listChucNang = await _dbContext.M_NhomQuyen_ChucNang.Where(x => x.Deleted == 0 && x.DonVi == user.DonVi && user.Permistion == x.Ma_NhomQuyen).ToListAsync();
                if (listChucNang != null && listChucNang.Count > 0)
                {
                    userResponse.ListPermission = listChucNang.Select(x => int.Parse(x.Ma_ChucNang)).ToList();
                }
                else
                {
                    userResponse.ListPermission = new List<int>();
                }
                var nhomQuyen = await _dbContext.M_NhomQuyen.FirstOrDefaultAsync(x => x.Deleted == 0 && x.DonVi == user.DonVi && x.Ma_NhomQuyen == user.Permistion);

                userResponse.TenDonVi = donVi.TenDonVi;
                userResponse.DiaChiDonVi = donVi.DiaChiDonVi;
                userResponse.NganhHang = donVi.NganhHang;
                userResponse.Role_Code = user.Role_Code;
                userResponse.Phone = donVi.DienThoaiLienHe;
                userResponse.Ma_NhomQuyen = user.Permistion;
                userResponse.TenNhomQuyen = user.IsAdministrator == "1" ? "Administrator" : nhomQuyen?.TenNhomQuyen + "";
                userResponse.Pin = user.PIN + "";
                userResponse.IsAdministrator = user.IsAdministrator;
                userResponse.LogoDonVi = donVi.LogoDonVi;
                userResponse.AnhBiaSPDonVi = donVi.AnhBiaSPDonVi;
                userResponse.AnhBiaPCDonVi = donVi.AnhBiaPCDonVi;
                userResponse.AnhBiaIPDonVi = donVi.AnhBiaIPDonVi;
                userResponse.AnhNganHang = donVi.AnhNganHang;
            }
            return userResponse;
        }

        public async Task<M_User> GetUserByUserName(string userName)
        {
           var user = await _dbContext.M_User.FirstOrDefaultAsync(x=>x.UserName == userName && x.IsLock == 0);
            return user;
        }
    }
}
