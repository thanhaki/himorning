using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhanVienHeSo.Commands
{
    public class AddNhanVienHeSoCommand
    {
        public class AddNhanVienHeSoCoRequest : IRequest<int>
        {
            public class HeSoLuongNhanVien
            {
                public int? So_NV { get; set; }
                public double CongChuan { get; set; }
                public double LuongCoBan { get; set; }
                public double HeSoLuong { get; set; }
                public double HeSoTrachNhiem { get; set; }
                public double PhuCapThang { get; set; }
                public double TangCaGio { get; set; }
                public double BaoHiemXaHoi { get; set; }
                public double LuongDuKien { get; set; }
                public string? GhiChu { get; set; }
            }
            public List<HeSoLuongNhanVien>? ListHeSoLuong { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<AddNhanVienHeSoCoRequest, int>
        {
            private readonly INhanVienHeSoRepository _nhanVienHeSoRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddNhanVienHeSoCommand> _logger;
            public Handler(INhanVienHeSoRepository nhanVienHeSoRepository, IMapper mapper, ILogger<AddNhanVienHeSoCommand> logger, IDonViRepository donViRepository)
            {
                _nhanVienHeSoRepository = nhanVienHeSoRepository ?? throw new ArgumentNullException(nameof(nhanVienHeSoRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _donViRepository = donViRepository;
            }

            public async Task<int> Handle(AddNhanVienHeSoCoRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        return 0;
                    }
                    if (request.ListHeSoLuong != null && request.ListHeSoLuong.Count > 0)
                    {
                        List<M_NhanVien_HeSo> lst = new List<M_NhanVien_HeSo>();
                        foreach (var item in request.ListHeSoLuong)
                        {
                            Expression<Func<M_NhanVien_HeSo, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.So_NV == item.So_NV;
                            var checkNv = await _nhanVienHeSoRepository.GetFirstOrDefaultAsync(fillter);
                            if (checkNv != null)
                            {
                                checkNv.CongChuan = item.CongChuan;
                                checkNv.LuongCoBan = item.LuongCoBan;
                                checkNv.HeSoLuong = item.HeSoLuong;
                                checkNv.HeSoTrachNhiem = item.HeSoTrachNhiem;
                                checkNv.PhuCapThang = item.PhuCapThang;
                                checkNv.TangCaGio = item.TangCaGio;
                                checkNv.BaoHiemXaHoi = item.BaoHiemXaHoi;
                                checkNv.LuongDuKien = item.LuongDuKien;
                                checkNv.GhiChu = item.GhiChu ?? "";
                                await _nhanVienHeSoRepository.UpdateAsync(checkNv);
                            }
                            else
                            {
                                M_NhanVien_HeSo nv = new M_NhanVien_HeSo();
                                nv.So_NV = item.So_NV.Value;
                                nv.CongChuan = item.CongChuan;
                                nv.LuongCoBan = item.LuongCoBan;
                                nv.HeSoLuong = item.HeSoLuong;
                                nv.HeSoTrachNhiem = item.HeSoTrachNhiem;
                                nv.PhuCapThang = item.PhuCapThang;
                                nv.TangCaGio = item.TangCaGio;
                                nv.BaoHiemXaHoi = item.BaoHiemXaHoi;
                                nv.LuongDuKien = item.LuongDuKien;
                                nv.GhiChu = item.GhiChu ?? "";
                                nv.DonVi = request.DonVi;
                                lst.Add(nv);
                                await _nhanVienHeSoRepository.AddRangeAsync(lst);
                                lst.Clear();
                            }
                        }
                        _logger.LogInformation($"Nhan Vien He So {Unit.Value} is successfully created.");
                        return 1;
                    }
                    else
                    {
                        return -1;
                    }

                   
                }
                catch (Exception)
                {
                    return -1;
                    throw;
                }

            }
        }
    }
}
