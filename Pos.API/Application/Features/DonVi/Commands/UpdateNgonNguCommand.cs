using AutoMapper;
using MediatR;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.Linq.Expressions;

namespace User.API.Application.Features.DonVi.Commands
{
    public class UpdateNgonNguCommand
    {
        public class UpdateLanguage : IRequest<int>
        {
            public List<LanguageModelResponse> ListData { get; set; }
            public int MaNganhHang { get; set; }
        }

        public class Handler : IRequestHandler<UpdateLanguage, int>
        {
            private readonly IDonViRepository _donViRepository;
            private readonly ILanguageRepository _languageRepository;

            public Handler(
                IDonViRepository donViRepository, ILanguageRepository languageRepository)
            {
                _donViRepository = donViRepository ?? throw new ArgumentNullException(nameof(donViRepository));
                _languageRepository = languageRepository ?? throw new ArgumentNullException(nameof(languageRepository));
            }

            public async Task<int> Handle(UpdateLanguage request, CancellationToken cancellationToken)
            {
                Expression<Func<M_Language, bool>> getData = x => x.MaNganhHang == request.MaNganhHang;
                var listDdata = await _languageRepository.GetAsync(getData, null);

                if (listDdata.Count > 0)
                    await _languageRepository.DeleteRangeAsync(listDdata.ToList());

                foreach (var item in request.ListData)
                {
                    M_Language m_Language = new M_Language();
                    m_Language.Id = Guid.NewGuid();
                    m_Language.English = item.English;
                    m_Language.Vietnamese = item.VietNamese;
                    m_Language.MaChucNang = item.MaChucNang.Value;
                    m_Language.MaNganhHang = request.MaNganhHang;
                    await _languageRepository.AddAsync(m_Language);
                }
                return 1;
            }
        }
    }
}
