using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Identity.Client;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;
using System.Reflection;

namespace User.API.Application.Features.Users.Queries
{
    public class GetDonViListQuery
    {
        public class QueryRequest : IRequest<List<DonViModelResponse>> {
            public int TinhTrang { get; set; }
            public int Approved { get; set; }
            public string NameOrPhoneNumber { get; set; }
            public string[] SupporterName { get; set; }
        }

        public class Handler : IRequestHandler<QueryRequest, List<DonViModelResponse>>
        {
            private readonly IDonViRepository _donViRepository;
            private readonly IMDataRepository _mDataRepository;
            private readonly ISalerRepository _salerRepository;
            private readonly IMapper _mapper;

            public Handler(IDonViRepository donViRepository, IMapper mapper, IMDataRepository mDataRepository, ISalerRepository salerRepository)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _mDataRepository = mDataRepository;
                _salerRepository = salerRepository;
            }

            public async Task<List<DonViModelResponse>> Handle(QueryRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Data, bool>> filterTinhTrang = u => u.Deleted == 0 && !u.isLock && (u.GroupData == CmContext.GROUP_DATA.TTDONVI.ToDescription() || u.GroupData == CmContext.GROUP_DATA.PACKAGE.ToDescription());
                var listTinhTrang = await _mDataRepository.GetAsync(filterTinhTrang, null);

                Expression<Func<M_Saler, bool>> getSupporter = u => u.Deleted == 0 && (request.SupporterName.Length == 0|| request.SupporterName.Contains(u.Ten_Saler));
                var listSupporter = await _salerRepository.GetAsync(getSupporter, null);

                Expression<Func<M_DonVi, bool>> filterDv = x=>
                (string.IsNullOrEmpty(request.NameOrPhoneNumber) || 
                (x.TenDonVi.ToLower().Contains(request.NameOrPhoneNumber) || x.DienThoaiDonVi.ToLower().Contains(request.NameOrPhoneNumber))) &&
                (request.TinhTrang == 0 || request.TinhTrang == x.TinhTrang) &&
                (request.Approved == -1 || request.Approved == x.Approved) && x.Deleted == 0;

                var donVi = await _donViRepository.GetAsync(filterDv, null);
                if (request.SupporterName.Length != 0)
                {
                    donVi = donVi.Where(x => listSupporter.FirstOrDefault(y => y.Ma_Saler == x.Supporter) != null).ToList();
                }
                var result = donVi.Select(dv => new DonViModelResponse
                {
                    MaDonVi = dv.DonVi,
                    DiaChiDonVi = dv.DiaChiDonVi,
                    DienThoaiLienHe = dv.DienThoaiDonVi,
                    Email = dv.Email,
                    GoiDichVu = listTinhTrang.FirstOrDefault(x => x.No == dv.GoiDichVu)?.Code,
                    TenTinhTrang = listTinhTrang.FirstOrDefault(x => x.No == dv.TinhTrang)?.Data,
                    MaTinhTrang = dv.TinhTrang,
                    Supporter = listSupporter.FirstOrDefault(x=>x.Ma_Saler == dv.Supporter),
                    NgayDangKy = dv.NgayDangKy,
                    NgayGiaHan = dv.NgayGiaHan,
                    TenDonVi = dv.TenDonVi,
                    Approved = dv.Approved,

                }).OrderByDescending(x=>x.MaDonVi).ToList();

                return result;
            }
        }
    }
}
