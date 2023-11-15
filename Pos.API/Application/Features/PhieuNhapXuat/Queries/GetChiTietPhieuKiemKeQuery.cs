﻿using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Models;

namespace Pos.API.Application.Features.PhieuNhapXuat.Queries
{
    public class GetChiTietPhieuKiemKeQuery
    {
        public class PhieuKiemKeCT : IRequest<List<MatHangNhapXuatModelResponse>>
        {
            public int DonVi { get; set; }
            public int Ma_PNX { get; set; }
        }
        public class Handler : IRequestHandler<PhieuKiemKeCT, List<MatHangNhapXuatModelResponse>>
        {
            private readonly IPhieuNhapXuatCTRepository _phieuNhapXuatCTRepository;
            private readonly IMapper _mapper;

            public Handler(IPhieuNhapXuatCTRepository phieuNhapXuatCTRepository, IMapper mapper)
            {
                _phieuNhapXuatCTRepository = phieuNhapXuatCTRepository ?? throw new ArgumentNullException(nameof(phieuNhapXuatCTRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<List<MatHangNhapXuatModelResponse>> Handle(PhieuKiemKeCT request, CancellationToken cancellationToken)
            {
                var query = await _phieuNhapXuatCTRepository.GetChiTietPhieuKiemKe(request);
                return query.OrderByDescending(x => x.Id).ToList();

            }
        }
    }
}

