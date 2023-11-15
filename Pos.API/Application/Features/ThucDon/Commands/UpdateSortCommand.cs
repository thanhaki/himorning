using AutoMapper;
using MediatR;
using OfficeOpenXml.FormulaParsing.ExpressionGraph;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.ThucDon.Commands
{
    public class UpdateSortCommand
    {
        public class UpdateSortRequest : IRequest<int>
        {
            public int[] Ids { get; set; }
            public List<MenuItemUpdateModel>? MenuItems { get; set; }
            public class MenuItemUpdateModel
            {
                public int? Id { get; set; }
                public int? Sort { get; set; }
                public string Ten_TD { get; set; }
                public string? HinhAnh_TD { get; set; }
            }
            public int? DonVi { get; set; }
        }

        public class Handler : IRequestHandler<UpdateSortRequest, int>
        {
            private readonly IThucDonRepository _thucDonRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<UpdateSortRequest> _logger;
            public Handler(IThucDonRepository thucDonRepository, IMapper mapper, ILogger<UpdateSortRequest> logger)
            {
                _thucDonRepository = thucDonRepository ?? throw new ArgumentNullException(nameof(thucDonRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<int> Handle(UpdateSortRequest request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("Start UpdateSortRequest");
                try
                {
                    List<M_ThucDon> result = new List<M_ThucDon>();

                    var lst = await _thucDonRepository.GetThucDonByIds(request.Ids, request.DonVi.Value);

                    lst = lst.Select(itemLst =>
                    {
                        var matchingItem = request.MenuItems.ToList().FirstOrDefault(itemMenuSort => itemMenuSort.Id == itemLst.Ma_TD);
                        if (matchingItem != null)
                        {
                            itemLst.Sort = matchingItem.Sort;
                        }
                        return itemLst;
                    }).ToList();
                    await _thucDonRepository.UpdateRangeAsync(lst.ToList());

                    _logger.LogInformation($"Thuc Don Mat Hang {Unit.Value} is successfully created.");
                    return 1;
                }
                catch (Exception ex)
                {
                    return 0;
                }

            }
        }
    }
}
