using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pos.API.Domain.Entities;
using System.Data;
using System.Reflection.Emit;

namespace Pos.API.Infrastructure.Persistence
{
    public class DBPosContext : DbContext
    {
        public DBPosContext(DbContextOptions<DBPosContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<M_ThucDon_MatHang>().HasKey(table => new
            {
                table.Ma_TD, table.Ma_MH
            });
            builder.Entity<T_DonHangChiTiet>().HasKey(table => new
            {
                table.SoDonHang,
                table.Ma_MH
            });

            builder.Entity<M_NhomQuyen_ChucNang>().HasKey(table => new
            {
                table.Ma_ChucNang,
                table.Ma_NhomQuyen
            });

            builder.Entity<T_VerifyCode>().HasKey(table => new
            {
                table.DonVi,
                table.CodeVerify
            });
            
            builder.Entity<M_DonVi>().HasKey(table => new
            {
                table.DonVi,
            });

            builder.Entity<M_KhuyenMai_ApDung>().HasKey(table => new
            {
                table.SoKhuyenMaiApDung,
                table.SoKhuyenMai
            });

            builder.Entity<M_KhuyenMai_DoiTuong>().HasKey(table => new
            {
                table.SoKhuyenMaiDoiTuong,
                table.SoKhuyenMai
            });
            builder.Entity<M_KhuyenMai_KhoangThoiGian>().HasKey(table => new
            {
                table.SoKhuyenMaiKhoangThoiGian,
                table.SoKhuyenMai
            });
            builder.Entity<T_PhieuNhapXuat_ChiTiet>().HasKey(table => new
            {
                table.Ma_PNX,
                table.Ma_MH
            });
            builder.Entity<T_LichSuTichDiem_KhachHang>().HasKey(table => new
            {
                table.MaLichSuTichDiem,
                table.Ma_KH,
                table.SoDonHang,
            });
            builder.Entity<T_LichCongTac_NhanVien>().HasKey(table => new
            {
                table.So_NV,
                table.Month,
                table.Year,
            });
        }

        public DbSet<M_DonVi> M_DonVi { get; set; }
        public DbSet<M_DanhMuc_MatHang> M_DanhMuc_MatHang { get; set; }
        public DbSet<M_User> M_User { get; set; }
        public DbSet<M_MatHang> M_MatHang { get; set; }
        public DbSet<T_VerifyCode> T_VerifyCode { get; set; }
        public DbSet<M_Data> M_Data { get; set; }
        public DbSet<T_TokenInfo> T_TokenInfo { get; set; }
        public DbSet<M_DonVi_MatHang> M_DonVi_MatHang { get; set; }
        public DbSet<M_Saler> M_Saler { get; set; }
        public DbSet<M_Outlet> M_Outlet { get; set; }
        public DbSet<M_Ban> M_Ban { get; set; }
        public DbSet<M_ThucDon> M_ThucDon { get; set; }
        public DbSet<M_ThucDon_MatHang> M_ThucDon_MatHang { get; set; }
        public DbSet<M_NhomQuyen> M_NhomQuyen { get; set; }
        public DbSet<T_DonHang> T_DonHang { get; set; }
        public DbSet<T_DonHangChiTiet> T_DonHangChiTiet { get; set; }
        public DbSet<M_Printer> M_Printer { get; set; }
        public DbSet<M_NhomQuyen_ChucNang> M_NhomQuyen_ChucNang { get; set; }
        public DbSet<M_DanhMuc_ThuChi> M_DanhMuc_ThuChi { get; set; }
        public DbSet<T_LichSu_MatHang> T_LichSu_MatHang { get; set; }
        public DbSet<T_PhieuThuChi> T_PhieuThuChi { get; set; }
        public DbSet<M_KhachHang> M_KhachHang { get; set; }
        public DbSet<M_Nhom_KhachHang> M_Nhom_KhachHang { get; set; }
        public DbSet<M_HinhThucThanhToan> M_HinhThucThanhToan { get; set; }
        public DbSet<T_ThanhToan> T_ThanhToan { get; set; }
        public DbSet<M_TheThanhVien> M_TheThanhVien { get; set; }
        public DbSet<M_KhuyenMai> M_KhuyenMai { get; set; }
        public DbSet<M_KhuyenMai_ApDung> M_KhuyenMai_ApDung { get; set; }
        public DbSet<M_KhuyenMai_DoiTuong> M_KhuyenMai_DoiTuong { get; set; }
        public DbSet<M_KhuyenMai_KhoangThoiGian> M_KhuyenMai_KhoangThoiGian { get; set; }
        public DbSet<T_PhieuNhapXuat> T_PhieuNhapXuat { get; set; }
        public DbSet<T_PhieuNhapXuat_ChiTiet> T_PhieuNhapXuat_ChiTiet { get; set; }
        public DbSet<T_LichSuTichDiem_KhachHang> T_LichSuTichDiem_KhachHang { get; set; }
        public DbSet<M_NhanVien_HoSo> M_NhanVien_HoSo { get; set; }
        public DbSet<M_NhanVien> M_NhanVien { get; set; }
        public DbSet<M_CaLamViec> M_CaLamViec { get; set; }
        public DbSet<M_Language> M_Language { get; set; }
        public DbSet<M_NhanVien_HeSo> M_NhanVien_HeSo { get; set; }
        public DbSet<T_LichCongTac_NhanVien> T_LichCongTac_NhanVien { get; set; }
        public DbSet<T_Luong> T_Luong { get; set; }
    }
}
