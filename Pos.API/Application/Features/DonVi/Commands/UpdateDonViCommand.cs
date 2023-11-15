using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Linq.Expressions;

namespace User.API.Application.Features.DonVi.Commands
{
    public class UpdateDonViCommand
    {
        public class DonViRequest : IRequest<int>
        {
            public int DonVi { get; set; }
            public string TenDonVi { get; set; }
            public string DiaChiDonVi { get; set; }
            public int NganhHang { get; set; }
            public string DienThoaiDonVi { get; set; }
        }

        public class Handler : IRequestHandler<DonViRequest, int>
        {
            private readonly IDonViRepository _donViRepository;

            public Handler(
                IDonViRepository donViRepository)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }

            public async Task<int> Handle(DonViRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var donvi = await _donViRepository.GetByIdAsync(request.DonVi);

                    if (donvi != null)
                    {
                        donvi.TenDonVi = request.TenDonVi;
                        donvi.NganhHang = request.NganhHang;
                        donvi.DienThoaiDonVi = request.DienThoaiDonVi;
                        donvi.DienThoaiLienHe = request.DienThoaiDonVi;
                        donvi.DiaChiDonVi = request.DiaChiDonVi;
                        await _donViRepository.UpdateAsync(donvi);
                        return 1;
                    }
                    return 0;
                }
                catch(Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}
