using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;
using System.Linq.Expressions;
using static Pos.API.Constans.CmContext;

namespace User.API.Application.Features.ElectronicMenu.Commands
{
    public class UpdateDescriptionProductCommand
    {
        public class DescriptionReq : IRequest<int>
        {
            public int Ma_MH { get; set; }
            public string? HinhAnh_ChiaSe { get; set; }
            public string? HinhAnh_MH01 { get; set; }
            public string? HinhAnh_MH02 { get; set; }
            public string? HinhAnh_MH03 { get; set; }
            public string? HinhAnh_MH04 { get; set; }
            public string? HinhAnh_MH05 { get; set; }
            public string? HinhAnh_MH06 { get; set; }
            public string? HinhAnh_MH07 { get; set; }
            public string? HinhAnh_MH08 { get; set; }
            public string? HinhAnh_MH09 { get; set; }
            public string? HinhAnh_MH10 { get; set; }
            public string? Video_MH { get; set; }
            public string? MieuTa_MH { get; set; }
            public int DonVi { get; set; }
            public string? FileName { get; set; }
        }

        public class Handler : IRequestHandler<DescriptionReq, int>
        {
            private readonly IMatHangRepository _matHangRepository;

            private readonly IMapper _mapper;
            private readonly ILogger<UpdateDescriptionProductCommand> _logger;
            public Handler(
                IMatHangRepository matHangRepository,
                IMapper mapper)
            {
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<int> Handle(DescriptionReq request, CancellationToken cancellationToken)
            {
                try
                {
                    Expression<Func<M_MatHang, bool>> getMh = x => x.Ma_MH == request.Ma_MH && x.Deleted == 0 && x.DonVi == request.DonVi;
                    var mh = await _matHangRepository.GetFirstOrDefaultAsync(getMh);
                    if (mh== null)
                    {
                        return -1;
                    }
                    switch (request.FileName)
                    {

                        case "IMAG1":
                            mh.HinhAnh_ChiaSe = request.HinhAnh_ChiaSe;
                            break;

                        case "IMAG2":
                            mh.HinhAnh_MH01 = request.HinhAnh_MH01;
                            break;

                        case "VIDEO":
                            mh.Video_MH = request.Video_MH;
                            break;

                        case "IMAG3":
                            mh.HinhAnh_MH02 = request.HinhAnh_MH02;
                            break;

                        case "IMAG4":
                            mh.HinhAnh_MH03 = request.HinhAnh_MH03;
                            break;

                        case "IMAG5":
                            mh.HinhAnh_MH04 = request.HinhAnh_MH04;
                            break;

                        case "IMAG6":
                            mh.HinhAnh_MH05 = request.HinhAnh_MH05;
                            break;

                        case "IMAG7":
                            mh.HinhAnh_MH06 = request.HinhAnh_MH06;
                            break;

                        case "IMAG8":
                            mh.HinhAnh_MH07 = request.HinhAnh_MH07;
                            break;

                        case "IMAG9":
                            mh.HinhAnh_MH08 = request.HinhAnh_MH08;
                            break;

                        case "IMAG10":
                            mh.HinhAnh_MH09 = request.HinhAnh_MH09;
                            break;

                        case "IMAG11":
                            mh.HinhAnh_MH10 = request.HinhAnh_MH10;
                            break;
                    }

                    if(string.IsNullOrEmpty(request.FileName))
                    {
                        mh.MieuTa_MH = request.MieuTa_MH;
                    }
                    await _matHangRepository.UpdateAsync(mh);
                    return 1;
                }
                catch(Exception ex)
                {
                    _logger.LogError(ex, "AddDonViRequest");
                    return 0;
                }
            }
        }
    }
}
