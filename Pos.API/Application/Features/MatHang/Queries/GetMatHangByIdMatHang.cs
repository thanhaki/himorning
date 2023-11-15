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

    public class GetMatHangByIdMatHang
    {
        public class QueryByIdMH : IRequest<ItemMatHangTD>
        {
            public int Id { get; set; }
            public int? DonVi { get; set; }
        }
        public class Handler : IRequestHandler<QueryByIdMH, ItemMatHangTD>
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

            public async Task<ItemMatHangTD> Handle(QueryByIdMH request, CancellationToken cancellationToken)
            {
                var query = await _MatHangRepository.GetMatHangById(request.Id, request.DonVi.Value);
                return query;

            }
        }
    }
}
