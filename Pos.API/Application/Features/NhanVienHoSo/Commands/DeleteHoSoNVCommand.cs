using AutoMapper;
using MediatR; 
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhanVienHeSo.Commands
{
    public class DeleteHoSoNVCommand
    {
        public class DeleteHoSoNVRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }

        }

        public class Handler : IRequestHandler<DeleteHoSoNVRequest>
        {
            private readonly IMNhanVienRepository _mNhanVienRepository;
            private readonly INhanVienHoSoRepository _nhanVienHoSoRepository;
            private readonly ILichLamViecNVRepository _lichLamViecNhanVienRepository;
            private readonly ILuongNhanVienRepository _luongNhanVienRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteHoSoNVCommand> _logger;
            public Handler(IMNhanVienRepository mNhanVienRepository, INhanVienHoSoRepository nhanVienHoSoRepository,
                IMapper mapper, ILogger<DeleteHoSoNVCommand> logger, ILichLamViecNVRepository lichLamViecNhanVienRepository, ILuongNhanVienRepository luongNhanVienRepository)
            {
                _mNhanVienRepository = mNhanVienRepository ?? throw new ArgumentNullException(nameof(mNhanVienRepository));
                _nhanVienHoSoRepository = nhanVienHoSoRepository ?? throw new ArgumentNullException(nameof(nhanVienHoSoRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _lichLamViecNhanVienRepository = lichLamViecNhanVienRepository;
                _luongNhanVienRepository = luongNhanVienRepository;
            }

            public async Task<Unit> Handle(DeleteHoSoNVRequest request, CancellationToken cancellationToken)
            {
                _mNhanVienRepository.BeginTransactionAsync();
                try
                {
                    Expression<Func<M_NhanVien, bool>> getByidNv = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.So_NV);
                    var list = await _mNhanVienRepository.GetAsync(getByidNv);
                    if (list.Count > 0)
                    {
                        list.ToList().ForEach(item => item.Deleted = 1);
                        await _mNhanVienRepository.UpdateRangeAsync(list.ToList());
                    }

                    Expression<Func<M_NhanVien_HoSo, bool>> getByidHs = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.So_NV);
                    var listFileHs = await _nhanVienHoSoRepository.GetAsync(getByidHs);
                    if (listFileHs.Count > 0)
                    {
                        listFileHs.ToList().ForEach(item => item.Deleted = 1);
                        await _nhanVienHoSoRepository.UpdateRangeAsync(listFileHs.ToList());
                    }

                    Expression<Func<T_LichCongTac_NhanVien, bool>> getByidCalv = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.So_NV);
                    var listCalamViec = await _lichLamViecNhanVienRepository.GetAsync(getByidCalv);
                    if (listCalamViec.Count > 0)
                    {
                        listCalamViec.ToList().ForEach(item => item.Deleted = 1);
                        await _lichLamViecNhanVienRepository.UpdateRangeAsync(listCalamViec.ToList());
                    }
                    Expression<Func<T_Luong, bool>> getByidLuongNv = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.So_NV);
                    var listLuong = await _luongNhanVienRepository.GetAsync(getByidLuongNv);
                    if (listLuong.Count > 0)
                    {
                        listLuong.ToList().ForEach(item => item.Deleted = 1);
                        await _luongNhanVienRepository.UpdateRangeAsync(listLuong.ToList());
                    }

                    _logger.LogInformation($"Ho so nhan vien {Unit.Value} is successfully deleted.");
                    _mNhanVienRepository.CommitTransactionAsync();
                    return Unit.Value;
                }
                catch (Exception)
                {
                    _mNhanVienRepository.RollbackTransactionAsync();
                    throw;
                }
            }
        }
    }
}