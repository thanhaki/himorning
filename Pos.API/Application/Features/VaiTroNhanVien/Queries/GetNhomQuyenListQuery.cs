using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;
using System.Reflection.Metadata;

namespace Pos.API.Application.Features.VaiTroNhanVien.Queries
{
    public class GetNhomQuyenListQuery
    {
        public class NhomQuyenQuery : IRequest<List<NhomQuyenModelResponse>>
        {
            public int DonVi { get; set; }
            public NhomQuyenQuery(int id)
            {
                DonVi = id;
            }
        }
        public class Handler   : IRequestHandler<NhomQuyenQuery, List<NhomQuyenModelResponse>>
        {
            private readonly INhomQuyenRepository _nhomQuyenRepository;
            private readonly IMapper _mapper;

            public Handler(INhomQuyenRepository nhomQuyenRepository, IMapper mapper)
            {
                _nhomQuyenRepository = nhomQuyenRepository ?? throw new ArgumentNullException(nameof(nhomQuyenRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<List<NhomQuyenModelResponse>> Handle(NhomQuyenQuery request, CancellationToken cancellationToken)
            {
                var List = await _nhomQuyenRepository.GetAllNhomQuyen(request);
                return List.ToList();
                
            }
        }
    }
}
