using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DonViMatHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Serilog.Filters;
using System.Linq.Expressions;
using User.API.Application.Features.Users.Queries;

namespace Pos.API.Application.Features.VaiTroNhanVien.Commands
{
    public class AddNhomQuyenCommand
    {
        public class AddNhomQuyenRequest : IRequest<int>
        {
            public string TenNhomQuyen { get; set; }
            public string GhiChuNhomQuyen { get; set; }
            public int DonVi { get; set; }
            public int Ma_NhomQuyen { get; set; }
            public int[] Ids { get; set; }
        }
        public class Handler : IRequestHandler<AddNhomQuyenRequest, int>
        {
            private readonly INhomQuyenRepository _nhomQuyenRepository;
            private readonly INhomQuyenChucNangRepository _nhomQuyenChucNangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<AddNhomQuyenCommand> _logger;
            public Handler(INhomQuyenRepository nhomQuyenRepository, INhomQuyenChucNangRepository nhomQuyenChucNangRepository, IMapper mapper, ILogger<AddNhomQuyenCommand> logger)
            {
                _nhomQuyenRepository = nhomQuyenRepository ?? throw new ArgumentNullException(nameof(nhomQuyenRepository));
                _nhomQuyenChucNangRepository = nhomQuyenChucNangRepository ?? throw new ArgumentNullException(nameof(nhomQuyenChucNangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<int> Handle(AddNhomQuyenRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    
                    _nhomQuyenChucNangRepository.BeginTransactionAsync();
                    var nhomQuyen = _mapper.Map<M_NhomQuyen>(request);
                    if (nhomQuyen != null)
                    {
                        Func<IQueryable<M_NhomQuyen>, IOrderedQueryable<M_NhomQuyen>> orderingFunc = x => x.OrderByDescending(X => X.Ma_NhomQuyen);
                        Expression<Func<M_NhomQuyen, bool>> fillter = u => u.TenNhomQuyen.ToLower() == request.TenNhomQuyen.ToLower() && u.Deleted == 0 && u.DonVi == request.DonVi;
                        var checkNq = await _nhomQuyenRepository.GetFirstOrDefaultAsync(fillter);
                        if (request.Ma_NhomQuyen == 0)
                        {
                            var maxId = await _nhomQuyenRepository.GetMaxIdAsync(orderingFunc);
                            if (checkNq != null)
                            {
                                _nhomQuyenChucNangRepository.CommitTransactionAsync();
                                return -1;
                            }
                            nhomQuyen.Ma_NhomQuyen = maxId == null ? 1 : maxId.Ma_NhomQuyen + 1;

                            List<M_NhomQuyen_ChucNang> lst = new List<M_NhomQuyen_ChucNang>();
                            for (int i = 0; i < request.Ids.Length; i++)
                            {
                                M_NhomQuyen_ChucNang td = new M_NhomQuyen_ChucNang();
                                td.Ma_NhomQuyen = nhomQuyen.Ma_NhomQuyen;
                                td.Ma_ChucNang = request.Ids[i].ToString();
                                td.DonVi = request.DonVi;
                                lst.Add(td);
                            }


                            await _nhomQuyenRepository.AddAsync(nhomQuyen);
                            await _nhomQuyenChucNangRepository.AddRangeAsync(lst);
                        }
                        else 
                        {
                            // xóa ct
                            Expression<Func<M_NhomQuyen_ChucNang, bool>> id = x => x.Deleted == 0 && x.DonVi == request.DonVi && x.Ma_NhomQuyen == request.Ma_NhomQuyen;
                            var lst = await _nhomQuyenChucNangRepository.GetAsync(id);
                            foreach (var item in lst)
                            {
                                await _nhomQuyenChucNangRepository.DeleteAsync(item);
                            }

                            //update add new ct
                            var result = await _nhomQuyenRepository.GetByIdAsync(request.Ma_NhomQuyen);
                            result.TenNhomQuyen = request.TenNhomQuyen;
                            result.GhiChuNhomQuyen = request.GhiChuNhomQuyen;
                            List<M_NhomQuyen_ChucNang> lstCtNew = new List<M_NhomQuyen_ChucNang>();
                            for (int i = 0; i < request.Ids.Length; i++)
                            {
                                M_NhomQuyen_ChucNang td = new M_NhomQuyen_ChucNang();
                                td.Ma_NhomQuyen = nhomQuyen.Ma_NhomQuyen;
                                td.Ma_ChucNang = request.Ids[i].ToString();
                                td.DonVi = request.DonVi;
                                lstCtNew.Add(td);
                            }

                            await _nhomQuyenRepository.UpdateAsync(result);
                            await _nhomQuyenChucNangRepository.AddRangeAsync(lstCtNew);
                        }
                        
                        _logger.LogInformation($"Nhom Quyen {Unit.Value} is successfully created.");
                    }
                    _nhomQuyenChucNangRepository.CommitTransactionAsync();
                    return 1;
                }
                catch (Exception)
                {
                    _nhomQuyenChucNangRepository.RollbackTransactionAsync();
                    throw;
                }
               
            }
        }
    }
}
