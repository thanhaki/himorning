using MediatR;
using AutoMapper;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;
using Pos.API.Infrastructure.Repositories;


namespace Pos.API.Application.Features.LuongNhanVien.Commands
{
    public class UpdateLuongNhanVienCommand
    {
        public class UpdateLuongNVRequest : IRequest<int>
        {
            public int DonVi { get; set; }
            public class LuongNhanVienUd
            {
                public int? So_NV { get; set; }
                public int? Year { get; set; }
                public int? Month { get; set; }
                public double? GioTangCa { get; set; }
                public double? LuongCapBac { get; set; }
                public double? LuongTrachNhiem { get; set; }
                public double? LuongTangCa { get; set; }
                public double? PhuCap { get; set; }
                public double? KhenThuong { get; set; }
                public double? BaoHiemXaHoi { get; set; }
                public double? KyLuat { get; set; }
                public double? LuongThucNhan { get; set; }
            }
            public List<LuongNhanVienUd>? ListLuongUd { get; set; }
        }

        public class Handler : IRequestHandler<UpdateLuongNVRequest, int>
        {
            private readonly ILuongNhanVienRepository _luongNhanVienRepository;
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateLuongNhanVienCommand> _logger;
            public Handler(ILuongNhanVienRepository luongNhanVienRepository, IDonViRepository donViRepository, IMapper mapper, ILogger<UpdateLuongNhanVienCommand> logger)
            {
                _luongNhanVienRepository = luongNhanVienRepository ?? throw new ArgumentNullException(nameof(luongNhanVienRepository));
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<int> Handle(UpdateLuongNVRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> predicate = x => x.Deleted == 0 && x.DonVi == request.DonVi;
                    var donVi = await _donViRepository.GetFirstOrDefaultAsync(predicate);
                    if (donVi == null)
                    {
                        return 0;
                    }

                    if (request.ListLuongUd != null && request.ListLuongUd.Count > 0)
                    {
                        List<T_Luong> lst = new List<T_Luong>();
                       
                        foreach (var item in request.ListLuongUd)
                        {
                            Expression<Func<T_Luong, bool>> fillter = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.So_NV == item.So_NV && u.Month == item.Month && u.Year == item.Year;
                            var update = await _luongNhanVienRepository.GetFirstOrDefaultAsync(fillter);
                            if (update != null)
                            {
                                update.GioTangCa = item.GioTangCa;
                                update.LuongTangCa = item.LuongTangCa;
                                update.KhenThuong = item.KhenThuong;
                                update.KyLuat = item.KyLuat;
                                update.LuongThucNhan = item.LuongThucNhan;
                                update.BaoHiemXaHoi = item.BaoHiemXaHoi;
                                await _luongNhanVienRepository.UpdateAsync(update);
                            }

                        }
                    }
                    _logger.LogInformation($"Luong nhan vien {Unit.Value} is successfully created.");
                    return 1;
                }
                catch (Exception ex)
                {
                    return -1;
                    throw;
                }
            }
        }
    }
}
