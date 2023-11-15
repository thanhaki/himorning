using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.ThucDon.Queries.GetMatHangToCheckThucDon;
using static Pos.API.Application.Features.ThucDonMatHang.Queries.GetThucDonMatHangQuery;

namespace Pos.API.Infrastructure.Repositories
{
    public class ThucDonMatHangRepository : RepositoryBase<M_ThucDon_MatHang>, IThucDonMatHangRepository
    {
        private readonly IMapper _mapper;
        public ThucDonMatHangRepository(DBPosContext dbContext,IMapper mapper, IHttpContextAccessor context) : base(dbContext, context)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<ThucDonMatHangModelResponse>> GetAllThucDonMatHang(GetThucDonMHQuery request)
        {

            var query =
             (from td in _dbContext.M_ThucDon
              join mh in _dbContext.M_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0) on td.Ma_TD equals mh.Ma_MH into gj
              from subpet in gj.DefaultIfEmpty()
              where td.Deleted == 0 && td.DonVi == request.DonVi 
              select new
              {
                  Ma_TD = td.Ma_TD,
                  Ten_TD = td.Ten_TD,
                  SoLuong = subpet.Ma_MH > 0 ? 1 : 0,
              }).GroupBy(x => new { x.Ma_TD, x.Ten_TD }).Select(group => new ThucDonMatHangModelResponse
              {
                  Id = group.Key.Ma_TD,
              });
            return query;
        }

        public async Task<IEnumerable<ThucDonModelResponse>> GetTDMatHangByDonVi(int donVi)
        {

            var mh = _dbContext.M_MatHang.Where(x => x.DonVi == donVi && x.Deleted == 0);
            var mhRespone = _mapper.Map<List<MatHangModelRespose>>(mh);

            var td = _dbContext.M_ThucDon.Where(x => x.DonVi == donVi && x.Deleted == 0).OrderBy(x => x.Sort);
            var tdRespone = _mapper.Map<List<ThucDonModelResponse>>(td);

            var dm_mh = _dbContext.M_ThucDon_MatHang.Where(x => x.Deleted == 0 && x.DonVi == donVi);

            foreach (var item in tdRespone)
            {
                var mhIds = dm_mh.Where(x => x.Ma_TD == item.Id).Select(x => x.Ma_MH);
                item.ListMatHang = mhRespone.Where(x=>mhIds.Contains(x.Id));
            }
            return tdRespone;
        }
        public async Task<IEnumerable<ThucDonMatHangIsCheckModelResponse>> GetMatHangToCheckThucDon(GetMatHangToCheck request)
        {

            var getThucDonById = _dbContext.M_ThucDon_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0 && x.Ma_TD == request.Ma_TD).ToList();
            var getMatHang = _dbContext.M_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0 && x.Ten_MH.Contains(request.NameProduct)).ToList();
            var getDanhMucById = _dbContext.M_DanhMuc_MatHang.Where(x => x.DonVi == request.DonVi && x.Deleted == 0 && (request.danhMuc == 0 || x.Ma_DanhMuc == request.danhMuc)).ToList();


            var result = (from mh in getMatHang
                          join dm in getDanhMucById on mh.Ma_DanhMuc equals dm.Ma_DanhMuc
                          join tdmh in getThucDonById on mh.Ma_MH equals tdmh.Ma_MH into gj
                          from subpet in gj.DefaultIfEmpty()
                          where mh.Deleted == 0 && mh.DonVi == request.DonVi
                     select new ThucDonMatHangIsCheckModelResponse
                     {
                         Ma_MH = mh.Ma_MH,
                         Ten_MH = mh.Ten_MH,
                         Ma_DanhMuc = mh.Ma_DanhMuc,
                         IsCheck = subpet == null ? false: true
                     }).OrderByDescending(x => x.Ma_MH).ToList();
            return result;
        }
        public async Task<IEnumerable<ThucDonModelResponse>> GetThucDonMHById(int donVi, int maMh)
        {

            var getThucDonById = _dbContext.M_ThucDon_MatHang.Where(x => x.DonVi == donVi && x.Deleted == 0 && x.Ma_MH == maMh);

            var result = (from td in _dbContext.M_ThucDon
                          join tdmh in getThucDonById on td.Ma_TD equals tdmh.Ma_TD into gj
                          from subpet in gj.DefaultIfEmpty()
                          where td.Deleted == 0 && td.DonVi == donVi
                          select new ThucDonModelResponse
                          {
                              Id = td.Ma_TD,
                              Ma_TD = td.Ma_TD,
                              Ten_TD = td.Ten_TD,
                              IsCheck = subpet == null ? false : true
                          });
            return result;
        }
    }
}
