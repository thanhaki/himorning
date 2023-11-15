using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;

namespace User.API.Application.Features.DanhMuc.Queries
{

    public class GetDanhMucListQuery
    {
        public class GetDanhMucQuery : IRequest<List<DanhMucModelResponse>>
        {
            public int DONVI { get; set; }
            public GetDanhMucQuery(int id)
            {
                DONVI = id;
            }
        }

        public class Handler : IRequestHandler<GetDanhMucQuery, List<DanhMucModelResponse>>
        {
            private readonly IDanhMucMHRepository _danhMucRepository;
            private readonly IMapper _mapper;

            public Handler(IDanhMucMHRepository danhMucRepository, IMapper mapper)
            {
                _danhMucRepository = danhMucRepository ?? throw new ArgumentNullException(nameof(danhMucRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<DanhMucModelResponse>> Handle(GetDanhMucQuery request, CancellationToken cancellationToken)
            {
                var danhMuc = await _danhMucRepository.GetAllDanhMucMatHang(request.DONVI);
                return danhMuc.ToList();
            }
        }
    }
}
