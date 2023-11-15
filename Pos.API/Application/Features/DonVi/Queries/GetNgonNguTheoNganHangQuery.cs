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
    public class GetNgonNguTheoNganHang
    {
        public class LangageQuery : IRequest<IEnumerable<LanguageModelResponse>> {
            public int NganhHang { get; set; }
            public int DonVi { get; set; }

            public LangageQuery(int nganhHang, int donVi )
            {
                NganhHang = nganhHang;
                DonVi = donVi;
            }
        }

        public class Handler : IRequestHandler<LangageQuery, IEnumerable<LanguageModelResponse>>
        {
            private readonly IDonViRepository _donViRepository;
            private readonly IMapper _mapper;

            public Handler(IDonViRepository donViRepository, IMapper mapper)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<IEnumerable<LanguageModelResponse>> Handle(LangageQuery request, CancellationToken cancellationToken)
            {
                if (request.NganhHang == 0)
                {
                    return Enumerable.Empty<LanguageModelResponse>();
                }
                var listTinhTrang = await _donViRepository.GetNgonNguTheoNganHang(request.NganhHang, request.DonVi);
                return listTinhTrang;
            }
        }
    }
}
