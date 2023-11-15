using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Infrastructure.Persistence;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Infrastructure.Services;
using Pos.API.Models;

namespace Pos.API.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DBPosContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("ConnectionString")));

            services.AddScoped(typeof(IAsyncRepository<>), typeof(RepositoryBase<>));
            services.AddScoped<IDonViRepository, DonViRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IDanhMucMHRepository, DanhMucRepository>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddScoped<IMatHangRepository, MatHangRepository>();
            services.AddScoped<IVerifyCodeRepository, VerifyCodeRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped<IMDataRepository, MDataRepository>();
            services.AddScoped<IDonViMathangRepository, DonViMatHangRepository>();
            services.AddScoped<ISalerRepository, SalerRepository>();
            services.AddScoped<IOutletRepository, OutletRepository>();
            services.AddScoped<IBanRepository, BanRepository>();
            services.AddScoped<IThucDonRepository, ThucDonRepository>();
            services.AddScoped<IThucDonMatHangRepository, ThucDonMatHangRepository>();
            services.AddScoped<INhomQuyenRepository, NhomQuyenRepository>();
            services.AddScoped<IDonHangRepository, DonHangRepository>();
            services.AddScoped<IDonHangChiTietRepository, DonHangChiTietRepository>();
            services.AddScoped<IPrinterRepository, PrinterRepository>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<INhomQuyenChucNangRepository, NhomQuyenChucNangRepository>();
            services.AddScoped<IDanhMucThuChiRepository, DanhMucThuChiRepository>();
            services.AddScoped<ILichSuDonHangRepository, LichSuDonHangRepository>();
            services.AddScoped<INhanVienRepository, NhanVienRepository>();
            services.AddScoped<IPhieuThuChiRepository, PhieuThuChiRepository>();
            services.AddScoped<IKhachHangRepository, KhachHangRepository>();
            services.AddScoped<INhomKhachHangRepository, NhomKhachHangRepository>();
            services.AddScoped<IHinhThucTTRepository, HinhThucTTRepository>();
            services.AddScoped<IThanhToanRepository, ThanhToanRepository>();
            services.AddScoped<ITheThanhVienRepository, TheThanhVienRepository>();
            services.AddScoped<IKhuyenMaiRepository, KhuyenMaiRepository>();
            services.AddScoped<IKhuyenMaiApDungRepository, KhuyenMaiApDungRepository>();
            services.AddScoped<IKhuyenMaiDoiTuongRepository, KhuyenMaiDoiTuongRepository>();
            services.AddScoped<IKhuyenMaiKTGRepository, KhuyenMaiKTGRepository>();
            services.AddScoped<IPhieuNhapXuatRepository, PhieuNhapXuatRepository>();
            services.AddScoped<IPhieuNhapXuatCTRepository, PhieuNhapXuatCTRepository>();
            services.AddScoped<ILoaiPhieuRepository, LoaiPhieuRepository>();
            services.AddScoped<ILichSuTichDiemKHRepository, LichSuTichDiemKHRepository>();
            services.AddScoped<INhanVienHoSoRepository, NhanVienHoSoRepository>();
            services.AddScoped<IMNhanVienRepository, MNhanVienRepository>();
            services.AddScoped<ICaLamViecRepository, CaLamViecRepository>();
            services.AddScoped<ILanguageRepository, LanguageRepository>();
            services.AddScoped<INhanVienHeSoRepository, NhanVienHeSoRepository>();
            services.AddScoped<ILichLamViecNVRepository, LichLamViecNhanVienRepository>();
            services.AddScoped<ILuongNhanVienRepository, LuongNhanVienRepository>();
            services.AddScoped<IVnPayService, VnPayService>();

            // Or you can also register as follows
            services.AddHttpContextAccessor();
            return services;
        }
    }
}
