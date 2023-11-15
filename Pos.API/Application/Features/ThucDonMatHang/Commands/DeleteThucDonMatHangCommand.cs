using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;

namespace Pos.API.Application.Features.ThucDonMatHang.Commands
{
    public class DeleteThucDonMatHangCommand
    {
        public class DeleteThucDonMHRequest : IRequest
        {
            public int Id_TD { get; set; }
            public int Id_MH { get; set; }
            public int DonVi { get; set; }
        }
        public class Handler : IRequestHandler<DeleteThucDonMHRequest>
        {
            private readonly IThucDonMatHangRepository _thucDonRepository;
            public Handler(IThucDonMatHangRepository thucDonRepository)
            {
                _thucDonRepository = thucDonRepository ?? throw new ArgumentNullException(nameof(thucDonRepository));
            }

            public async Task<Unit> Handle(DeleteThucDonMHRequest request, CancellationToken cancellationToken)
            {
                Expression<Func<M_ThucDon_MatHang, bool>> getByid = x => x.Deleted == 0 && x.Ma_TD == request.Id_TD && x.Ma_MH == request.Id_MH && x.DonVi == request.DonVi;
                var lst = await _thucDonRepository.GetAsync(getByid);
                foreach (var item in lst)
                {
                    await _thucDonRepository.DeleteAsync(item);
                }
                return Unit.Value;
            }
        }
    }
}
