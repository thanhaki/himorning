using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.LuongNhanVien.Queries
{
    public class GetListSearchSalaryQueries
    {
        public class LuongNhanVien : IRequest<List<LuongNhanVienModelResponse>>
        {
            public int DonVi { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public int? Status { get; set; }
        }
        public class Handler : IRequestHandler<LuongNhanVien, List<LuongNhanVienModelResponse>>
        {
            private readonly ILuongNhanVienRepository _luongNhanVienRepository;
            private readonly IMapper _mapper;

            public Handler(ILuongNhanVienRepository luongNhanVienRepository, IMapper mapper)
            {
                _luongNhanVienRepository = luongNhanVienRepository ?? throw new ArgumentNullException(nameof(luongNhanVienRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<LuongNhanVienModelResponse>> Handle(LuongNhanVien request, CancellationToken cancellationToken)
            {
                try
                {
                    if (request.Status == 0)
                    {
                        var list = await _luongNhanVienRepository.GetAllLuongNhanVien(request);
                        return list.ToList();
                    }
                    else
                    {
                        Expression<Func<T_Luong, bool>> getIdLuongThang = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.Month == request.Month && x.Year == request.Year;
                        var getBydIdCa = await _luongNhanVienRepository.GetAsync(getIdLuongThang);
                        if (getBydIdCa.Count > 0)
                        {
                            await _luongNhanVienRepository.DeleteRangeAsync(getBydIdCa.ToList());
                        }

                        var list = await _luongNhanVienRepository.GetAllLuongNhanVien(request);
                        List<T_Luong> lst = new List<T_Luong>();
                        foreach (var item in list.ToList())
                        {
                            Expression<Func<T_Luong, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi
                                            && u.So_NV == item.So_NV && u.Month == request.Month && u.Year == request.Year;
                            var checkMonthYear = await _luongNhanVienRepository.GetFirstOrDefaultAsync(fillter);
                            if (checkMonthYear == null)
                            {
                                T_Luong salary = new T_Luong();
                                salary.So_NV = item.So_NV;
                                salary.Year = item.Year;
                                salary.Month = item.Month;
                                salary.HeSoCapBac = item.HeSoCapBac;
                                salary.HeSoTrachNhiem = item.HeSoTrachNhiem;
                                salary.LuongCoBanNgay = item.LuongCoBanNgay;
                                salary.LuongCoBanTangCa = item.LuongCoBanTangCa;
                                salary.SoCong = item.SoCong;
                                salary.GioTangCa = item.GioTangCa;
                                salary.LuongCapBac = item.LuongCapBac;
                                salary.LuongTrachNhiem = item.LuongTrachNhiem;
                                salary.LuongTangCa = item.LuongTangCa;
                                salary.PhuCap = item.PhuCap;
                                salary.KhenThuong = item.KhenThuong;
                                salary.KyLuat = item.KyLuat;
                                salary.BaoHiemXaHoi = item.BaoHiemXaHoi;
                                salary.LuongThucNhan = item.LuongThucNhan;
                                salary.DonVi = request.DonVi;
                                lst.Add(salary);
                            }
                        }
                        await _luongNhanVienRepository.AddRangeAsync(lst);

                        return list.ToList();
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }
                
            }
        }
    }
}
