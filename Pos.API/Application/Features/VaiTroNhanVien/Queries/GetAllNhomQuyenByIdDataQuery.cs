using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Models;

namespace Pos.API.Application.Features.VaiTroNhanVien.Queries
{
    public class GetAllNhomQuyenByIdDataQuery
    {
        public class NhomQuyenByIdDataQuery : IRequest<MDataGroupChucNangResponse>
        {
            public int M_NhomQuyen { get; set; }
            public int DonVi { get; set; }

        }
        public class Handler : IRequestHandler<NhomQuyenByIdDataQuery, MDataGroupChucNangResponse>
        {
            private readonly INhomQuyenRepository _nhomQuyenRepository;
            private readonly INhomQuyenChucNangRepository _nhomQuyenChucNangRepository;
            private readonly IMapper _mapper;

            public Handler(INhomQuyenRepository nhomQuyenRepository, INhomQuyenChucNangRepository nhomQuyenChucNangRepository, IMapper mapper)
            {
                _nhomQuyenRepository = nhomQuyenRepository ?? throw new ArgumentNullException(nameof(nhomQuyenRepository));
                _nhomQuyenChucNangRepository = nhomQuyenChucNangRepository ?? throw new ArgumentNullException(nameof(nhomQuyenChucNangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<MDataGroupChucNangResponse> Handle(NhomQuyenByIdDataQuery request, CancellationToken cancellationToken)
            {
                var List = (_nhomQuyenRepository.GetAllNhomQuyenByIdData(request).Result).ToList();
                return new MDataGroupChucNangResponse
                {
                    DangKy = List.Where(x => x.Type == CmContext.TYPE_DATA.DANGKY.ToDescription()).ToList(),
                    BanHang = List.Where(x => x.Type == CmContext.TYPE_DATA.BANHANG.ToDescription()).ToList(),
                    ThietLap = List.Where(x => x.Type == CmContext.TYPE_DATA.THIETLAP.ToDescription()).ToList(),
                    ThuChi = List.Where(x => x.Type == CmContext.TYPE_DATA.THUCHI.ToDescription()).ToList(),
                    BaoCao = List.Where(x => x.Type == CmContext.TYPE_DATA.BAOCAO.ToDescription()).ToList(),
                    MatHang = List.Where(x => x.Type == CmContext.TYPE_DATA.MATHANG.ToDescription()).ToList(),
                    KhoHang = List.Where(x => x.Type == CmContext.TYPE_DATA.KHOHANG.ToDescription()).ToList(),
                    DoiTuong = List.Where(x => x.Type == CmContext.TYPE_DATA.DOITUONG.ToDescription()).ToList(),
                    ListCheck = List.Where(x => x.IsCheck == true).Select(x => x.No).ToList(),
                };
            }
        }
    }
}
