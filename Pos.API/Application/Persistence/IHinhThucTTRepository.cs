﻿using Microsoft.AspNetCore.Identity;
using Pos.API.Domain.Entities;
using System.Linq.Expressions;
using System.Security;

namespace Pos.API.Application.Persistence
{
    public interface IHinhThucTTRepository : IAsyncRepository<M_HinhThucThanhToan>
    {
    }
}
