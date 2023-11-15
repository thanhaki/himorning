using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Identity.Client;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;
using System.Reflection;

namespace User.API.Application.Features.Users.Queries
{
    public class GetDonViById
    {
        public class QueryRequestId : IRequest<M_DonVi> {
            public int Id { get; set; }

            public QueryRequestId(int id)
            {
                Id = id;
            }
        }

        public class Handler : IRequestHandler<QueryRequestId, M_DonVi>
        {
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;

            public Handler(IDonViRepository donViRepository, IMapper mapper)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<M_DonVi> Handle(QueryRequestId request, CancellationToken cancellationToken)
            {
                var listTinhTrang = await _donViRepository.GetByIdAsync(request.Id);
                return listTinhTrang;
            }
        }
    }
}
