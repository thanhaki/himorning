using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using Pos.API.Models.ElectronicMenu;

namespace User.API.Application.Features.MatHang.Queries
{

    public class GetMatHangByQRCode
    {
        public class QueryByQRCode : IRequest<MatHangModelRespose>
        {
            public string QRCode { get; set; }
            public int? DonVi { get; set; }
            public QueryByQRCode(string qr, int dv)
            {
                QRCode = qr;
                DonVi = dv;
            }
        }
        public class Handler : IRequestHandler<QueryByQRCode, MatHangModelRespose>
        {
            private readonly IMatHangRepository _MatHangRepository;
            private readonly IDanhMucMHRepository _danhMucRepository;
            private readonly IMapper _mapper;

            public Handler(IDanhMucMHRepository DanhMucRepository, IMatHangRepository MatHangRepository, IMapper mapper)
            {
                _MatHangRepository = MatHangRepository ?? throw new ArgumentNullException(nameof(MatHangRepository));
                _danhMucRepository = DanhMucRepository ?? throw new ArgumentNullException(nameof(DanhMucRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<MatHangModelRespose> Handle(QueryByQRCode request, CancellationToken cancellationToken)
            {
                var query = _MatHangRepository.GetMatHangByQrCode(request.QRCode, request.DonVi.Value);
                if (query == null)
                {
                    return null;
                }
                var data = _mapper.Map<MatHangModelRespose>(query);
                data.SoLuong = 1;
                return data;

            }
        }
    }
}
