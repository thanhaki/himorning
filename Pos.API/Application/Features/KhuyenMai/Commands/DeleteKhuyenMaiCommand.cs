using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.KhuyenMai.Commands
{
    public class DeleteKhuyenMaiCommand
    {
        public class DeleteKhuyenMaiRequest : IRequest
        {
            public int[] Ids { get; set; }
            public int DonVi { get; set; }

        }

        public class Handler : IRequestHandler<DeleteKhuyenMaiRequest>
        {
            private readonly IKhuyenMaiRepository _khuyenMaiRepository;
            private readonly IKhuyenMaiApDungRepository _khuyenMaiADRepository;
            private readonly IKhuyenMaiDoiTuongRepository _khuyenMaiDTRepository;
            private readonly IKhuyenMaiKTGRepository _khuyenMaiTGRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<DeleteKhuyenMaiCommand> _logger;
            public Handler(IKhuyenMaiRepository khuyenMaiRepository, IKhuyenMaiApDungRepository khuyenMaiADRepository,
                    IKhuyenMaiDoiTuongRepository khuyenMaiDTRepository, IKhuyenMaiKTGRepository khuyenMaiTGRepository, IMapper mapper, ILogger<DeleteKhuyenMaiCommand> logger)
            {
                _khuyenMaiRepository = khuyenMaiRepository ?? throw new ArgumentNullException(nameof(khuyenMaiRepository));
                _khuyenMaiADRepository = khuyenMaiADRepository ?? throw new ArgumentNullException(nameof(khuyenMaiADRepository));
                _khuyenMaiDTRepository = khuyenMaiDTRepository ?? throw new ArgumentNullException(nameof(khuyenMaiDTRepository));
                _khuyenMaiTGRepository = khuyenMaiTGRepository ?? throw new ArgumentNullException(nameof(khuyenMaiTGRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<Unit> Handle(DeleteKhuyenMaiRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_KhuyenMai, bool>> getByid = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.SoKhuyenMai);
                var list = await _khuyenMaiRepository.GetAsync(getByid);
                list.ToList().ForEach(item => item.Deleted = 1);
                await _khuyenMaiRepository.UpdateRangeAsync(list.ToList());

                Expression<Func<M_KhuyenMai_ApDung, bool>> getByidAd = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.SoKhuyenMai);
                var listKmAd = await _khuyenMaiADRepository.GetAsync(getByidAd);
                await _khuyenMaiADRepository.DeleteRangeAsync(listKmAd.ToList());

                Expression<Func<M_KhuyenMai_DoiTuong, bool>> getByidDt = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.SoKhuyenMai);
                var listKmDt = await _khuyenMaiDTRepository.GetAsync(getByidDt);
                await _khuyenMaiDTRepository.DeleteRangeAsync(listKmDt.ToList());

                Expression<Func<M_KhuyenMai_KhoangThoiGian, bool>> getByidTg = x => x.Deleted == 0 && x.DonVi == request.DonVi && request.Ids.Contains(x.SoKhuyenMai);
                var listKmTg = await _khuyenMaiTGRepository.GetAsync(getByidTg);
                await _khuyenMaiTGRepository.DeleteRangeAsync(listKmTg.ToList());
                _logger.LogInformation($"Khuyen mai {Unit.Value} is successfully deleted.");
                return Unit.Value;
            }
        }
    }
}