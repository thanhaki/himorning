using Microsoft.AspNetCore.Identity;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.Linq.Expressions;
using System.Security;

namespace Pos.API.Application.Persistence
{
    public interface IDonViRepository: IAsyncRepository<M_DonVi>
    {
        Task<IEnumerable<LanguageModelResponse>> GetNgonNguTheoNganHang(int NganhHang, int DonVi);
    }
}
