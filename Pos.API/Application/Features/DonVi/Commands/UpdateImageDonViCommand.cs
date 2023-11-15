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
    public class UpdateImageDonViCommand
    {
        public class ImageRequest : IRequest<int>
        {
            public int DonVi { get; set; }
            public string? LogoDonVi { get; set; }
            public string? AnhBiaPCDonVi { get; set; }
            public string? AnhBiaIPDonVi { get; set; }
            public string? AnhBiaSPDonVi { get; set; }
            public string? AnhNganHang { get; set; }
            public string? FileName { get; set; }
        }

        public class Handler : IRequestHandler<ImageRequest, int>
        {
            private readonly IDonViRepository _donViRepository;

            public Handler(
                IDonViRepository donViRepository)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
            }

            public async Task<int> Handle(ImageRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_DonVi, bool>> expression = x => x.DonVi == request.DonVi && x.Deleted == 0;
                    var donvi = await _donViRepository.GetFirstOrDefaultAsync(expression);

                    if (donvi != null)
                    {
                        switch (request.FileName)
                        {
                            case "LOGO":
                                donvi.LogoDonVi = request.LogoDonVi;
                                break;

                            case "COVER1":
                                donvi.AnhBiaPCDonVi = request.AnhBiaPCDonVi;
                                break;

                            case "COVER2":
                                donvi.AnhBiaIPDonVi = request.AnhBiaIPDonVi;
                                break;

                            case "COVER3":
                                donvi.AnhBiaSPDonVi = request.AnhBiaSPDonVi;
                                break;
                            default:
                                donvi.AnhNganHang = request.AnhNganHang;
                                break;
                        }
                        await _donViRepository.UpdateAsync(donvi);
                        return 1;
                    }
                    return 0;
                }
                catch(Exception ex)
                {
                    return 0;
                }
            }
        }
    }
}
