using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.NhanVienHeSo.Queries
{
    public class GetLoaiPhongBan_TinhTrang
    {
        public class LoaiPbTinhTrang : IRequest<MDataResponse>
        {
            public int DonVi { get; set; }

        }
        public class Handler : IRequestHandler<LoaiPbTinhTrang, MDataResponse>
        {
            private readonly INhanVienHoSoRepository _loaiPbTinhTrangRepository;
            private readonly IMapper _mapper;

            public Handler(INhanVienHoSoRepository loaiPbTinhTrangRepository, IMapper mapper)
            {
                _loaiPbTinhTrangRepository = loaiPbTinhTrangRepository ?? throw new ArgumentNullException(nameof(loaiPbTinhTrangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<MDataResponse> Handle(LoaiPbTinhTrang request, CancellationToken cancellationToken)
            {
                var List = (_loaiPbTinhTrangRepository.GetPbTinhTrangByIdData(request).Result).ToList();
                return new MDataResponse
                {
                    PhongBan = List.Where(x => x.Type == CmContext.TYPE_DATA.PHONGBAN.ToDescription()).ToList(),
                    TinhTrangHoSoNhanVien = List.Where(x => x.Type == CmContext.TYPE_DATA.TINHTRANGHOSONHANVIEN.ToDescription()).ToList(),
                    LoaiHoSoNhanVien = List.Where(x => x.Type == CmContext.TYPE_DATA.LOAIHOSONHANVIEN.ToDescription()).ToList(),
                    TrinhDo = List.Where(x => x.Type == CmContext.TYPE_DATA.TRINHDO.ToDescription()).ToList(),
                };
            }
        }
    }
}
