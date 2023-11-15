using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Serilog.Filters;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.ThucDon.Commands
{
    public class UpdateThucDonCommand
    {
        public class UpdateThucDonRequest : IRequest<int>
        {
            public int Ma_TD { get; set; }
            public int DonVi { get; set; }
            public string Ten_TD { get; set; }
            public string HinhAnh_TD { get; set; }
            public int[] Ids { get; set; }
        }

        public class Handler : IRequestHandler<UpdateThucDonRequest,int>
        {
            private readonly IThucDonRepository _thucDonRepository;
            private readonly IThucDonMatHangRepository _thucDonMHRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateThucDonCommand> _logger;
            public Handler(IThucDonRepository thucDonRepository, IThucDonMatHangRepository thucDonMHRepository, IMapper mapper, ILogger<UpdateThucDonCommand> logger)
            {
                _thucDonRepository = thucDonRepository ?? throw new ArgumentNullException(nameof(thucDonRepository));
                _thucDonMHRepository = thucDonMHRepository ?? throw new ArgumentNullException(nameof(DonViMatHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<int> Handle(UpdateThucDonRequest request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("Start UpdateThucDonCommand");

                try
                {
                    _thucDonMHRepository.BeginTransactionAsync();
                    //update name
                    Expression<Func<M_ThucDon, bool>> fillter = u => u.Ten_TD.ToLower() == request.Ten_TD.ToLower() && u.Deleted == 0 && u.Deleted == 0 && u.DonVi == request.DonVi;
                    var checkDm = await _thucDonRepository.GetFirstOrDefaultAsync(fillter);
                    if (checkDm != null && checkDm.Ten_TD.ToLower() != request.Ten_TD.ToLower())
                    {
                        _thucDonMHRepository.CommitTransactionAsync();
                        return -1;
                    } 
                        

                    Expression<Func<M_ThucDon, bool>> condition = u => u.Deleted == 0 && u.DonVi == request.DonVi && u.Ma_TD == request.Ma_TD;

                    var thucDon = await _thucDonRepository.GetFirstOrDefaultAsync(condition);
                    if (thucDon != null)
                    {
                        _mapper.Map(request, thucDon);

                        List<M_ThucDon_MatHang> lstMH = new List<M_ThucDon_MatHang>();
                        foreach (int item in request.Ids)
                        {
                            Expression<Func<M_ThucDon_MatHang, bool>> getByid = x => x.Deleted == 0 && x.Ma_TD == request.Ma_TD && x.Ma_MH == item;
                            var lst = await _thucDonMHRepository.GetFirstOrDefaultAsync(getByid);
                            if (lst == null)
                            {
                                M_ThucDon_MatHang td = new M_ThucDon_MatHang();
                                td.Ma_TD = request.Ma_TD;
                                td.Ma_MH = item;
                                td.DonVi = request.DonVi;
                                lstMH.Add(td);
                            }
                        }
                        
                        await _thucDonRepository.UpdateAsync(thucDon);
                        await _thucDonMHRepository.AddRangeAsync(lstMH);

                        _logger.LogInformation($"Thuc Don Mat Hang {Unit.Value} is successfully created.");
                    }
                    _thucDonMHRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception ex)
                {
                    _thucDonMHRepository.RollbackTransactionAsync();
                    return 0;
                }
                
            }
        }
    }
}
