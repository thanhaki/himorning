using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;

namespace User.API.Application.Features.MatHang.Queries
{

    public class GetMatHangListQuery
    {
        public class MatHangQuery : IRequest<List<MatHangModelRespose>>
        {
            public int DanhMuc { get; set; }
            public int Type { get; set; }
            public int DonVi { get; set; }
            public string NameProduct { get; set; }
        }
        public class Handler : IRequestHandler<MatHangQuery, List<MatHangModelRespose>>
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

            public async Task<List<MatHangModelRespose>> Handle(MatHangQuery request, CancellationToken cancellationToken)
            {
                var query = await _MatHangRepository.GetAllMatHang(request);
                return query.OrderByDescending(x => x.Id).ToList(); 

            }
        }
    }
}
