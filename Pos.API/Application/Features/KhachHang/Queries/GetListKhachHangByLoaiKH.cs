using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.KhachHang.Queries
{
    public class GetListKhachHangByLoaiKH
    {
        public class QueryByLoaiKH : IRequest<IEnumerable<KhachHangModelResponse>>
        {
            public int DonVi { get; set; }
            public int LoaiKH { get; set; }
            public QueryByLoaiKH(int DV, int loaiKH)
            {
                DonVi = DV;
                LoaiKH = loaiKH;
            }
        }

        public class Handler : IRequestHandler<QueryByLoaiKH, IEnumerable<KhachHangModelResponse>>
        {
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly IMapper _mapper;

            public Handler(IKhachHangRepository khachHangRepository, IMapper mapper)
            {
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<IEnumerable<KhachHangModelResponse>> Handle(QueryByLoaiKH request, CancellationToken cancellationToken)
            {

                Expression<Func<M_KhachHang, bool>> expression = x => x.Loai_KH == request.LoaiKH && x.Deleted == 0 && x.DonVi == request.DonVi;
                var lisKhachHang = await _khachHangRepository.GetAsync(expression, null);
                var data = _mapper.Map<List<KhachHangModelResponse>>(lisKhachHang);
                return data;
            }
        }
    }
}
