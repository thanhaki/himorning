using AutoMapper;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Models;
using static Pos.API.Application.Features.KhuyenMai.Queries.GetListTimeByIdKhuyenMai;

namespace Pos.API.Infrastructure.Repositories
{
    public class KhuyenMaiKTGRepository : RepositoryBase<M_KhuyenMai_KhoangThoiGian>, IKhuyenMaiKTGRepository
    {
        private readonly IMapper _mapper;
        public KhuyenMaiKTGRepository(DBPosContext dbContext, IHttpContextAccessor context) : base(dbContext, context)
        {

        }
        public async Task<IEnumerable<KhuyenMaiModalResponse>> GetListTimeKhuyenMaiBydId(TimeKhuyenMaiQuery request)
        {
            var result = (from km in _dbContext.M_KhuyenMai_KhoangThoiGian
                          where km.DonVi == request.DonVi && km.Deleted == 0 && km.SoKhuyenMai == request.SoKhuyenMai
                          select new KhuyenMaiModalResponse
                          {
                              Id = km.SoKhuyenMaiKhoangThoiGian,
                              SoKhuyenMaiKhoangThoiGian = km.SoKhuyenMaiKhoangThoiGian,
                              ThoiGianBatDau = km.ThoiGianBatDau,
                              ThoiGianKetThuc = km.ThoiGianKetThuc,
                              DonVi = km.DonVi,
                          }).OrderByDescending(x => x.DonVi).ToList();
            return result;
        }
    }
}
