using AutoMapper;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using static Pos.API.Application.Features.DanhMuc.Commands.AddDanhMucCommand;
using static Pos.API.Application.Features.DanhMuc.Commands.UpdateDanhMucMatHangCommand;
using static Pos.API.Application.Features.DonViMatHang.Commands.AddDonViMatHangCommand;
using static Pos.API.Application.Features.DonViMatHang.Commands.AddThucDonCommand;
using static Pos.API.Application.Features.DonViMatHang.Commands.UpdateDonViMatHangCommand;
using static Pos.API.Application.Features.MatHang.Commands.AddMatHangCommand;
using static Pos.API.Application.Features.MatHang.Commands.UpdateMatHangCommand;
using static Pos.API.Application.Features.NhanVien.Commands.AddNhanVienCommand;
using static Pos.API.Application.Features.Outlet.Commands.AddOutletCommand;
using static Pos.API.Application.Features.Printer.Commands.AddPrinterCommand;
using static Pos.API.Application.Features.Printer.Commands.UpdatePrinterCommand;
using static Pos.API.Application.Features.ThucDon.Commands.UpdateThucDonCommand;
using static Pos.API.Application.Features.ThucDonMatHang.Commands.AddThucDonMatHangCommand;
using static Pos.API.Application.Features.VaiTroNhanVien.Commands.AddNhomQuyenCommand;
using static Pos.API.Application.Features.VaiTroNhanVien.Commands.UpdateNhanVienCommand;
using static User.API.Application.Features.DonVi.Commands.AddDonViCommand;
using static Pos.API.Application.Features.DanhMucThuChi.Commands.AddDanhMucThuChiCommand;
using static Pos.API.Application.Features.DanhMucThuChi.Commands.UpdateDanhMucThuChiCommand;
using static Pos.API.Application.Features.PhieuThuChi.Commands.AddPhieuThuChiCommand;
using static Pos.API.Application.Features.KhachHang.Commands.AddKhachHangCommand;
using static Pos.API.Application.Features.NhomKhachHang.Commands.AddNhomKhachHangCommand;
using static Pos.API.Application.Features.NhomKhachHang.Commands.UpdateNhomKhachHangCommand;
using static Pos.API.Application.Features.KhachHang.Commands.UpdateKhachHangCommand;
using static Pos.API.Application.Features.NhomKhachHang.Commands.UpdateKhachHangByIdNhom;
using static Pos.API.Application.Features.TheThanhVien.Commands.AddTheThanhVienCommand;
using static Pos.API.Application.Features.TheThanhVien.Commands.UpdateTheThanhVienCommand;
using static Pos.API.Application.Features.TheThanhVien.Commands.UpdateTheKhachHangByIdThe;
using static Pos.API.Application.Features.KhuyenMai.Commands.AddKhuyenMaiCommand;
using static Pos.API.Application.Features.KhuyenMai.Commands.UpdateKhuyenMaiByIdCommand;
using static Pos.API.Application.Features.PhieuNhapXuat.Commands.AddPhieuNhapXuatCommand;
using static Pos.API.Application.Features.PhieuNhapXuat.Commands.UpdatePhieuNhapXuatCommand;
using static Pos.API.Application.Features.PhieuThuChi.Commands.UpdatePhieuThuChiCommand;
using static Pos.API.Application.Features.HinhThucTT.Commands.AddHinhThucTTCommand;
using static Pos.API.Application.Features.HinhThucTT.Commands.UpdateHinhThucTTCommand;
using static Pos.API.Application.Features.CaLamViec.Commands.AddCaLamViecCommand;
using static Pos.API.Application.Features.CaLamViec.Commands.UpdateCaLamViecCommand;
using static Pos.API.Application.Features.NhanVienHeSo.Commands.AddHoSoNhanVienCommand;
using static Pos.API.Application.Features.NhanVienHeSo.Commands.AddNhanVienHeSoCommand;
using static Pos.API.Application.Features.LichSuCongTacNhanVien.Commands.AddLichLamViecCommand;
using static Pos.API.Application.Features.LichSuCongTacNhanVien.Commands.UpdateLichLamViecCommand;
using static Pos.API.Application.Features.LuongNhanVien.Commands.UpdateLuongNhanVienCommand;
using static Pos.API.Application.Features.MatHang.Commands.ImportProductCommand;

namespace Pos.API.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<M_User, UserModelResponse>().ReverseMap();
            CreateMap<AddDonViRequest, M_DonVi>()
            .ForMember(destination => destination.DienThoaiDonVi, options => options.MapFrom(source => source.DienThoaiLienHe));
            CreateMap<M_DanhMuc_MatHang, DanhMucModelResponse>()
            .ForMember(destination => destination.Id, options => options.MapFrom(source => source.Ma_DanhMuc));

            CreateMap<M_DonVi_MatHang, DonViMatHangModelRespose>()
         .ForMember(destination => destination.Id, options => options.MapFrom(source => source.Ma_DonVi));

            CreateMap<AddDonViRequest, M_User>()
            .ForMember(destination => destination.Phone, options => options.MapFrom(source => source.DienThoaiLienHe))
            .ForMember(destination => destination.UserName, options => options.MapFrom(source => source.DienThoaiLienHe))
            .ForMember(destination => destination.FullName, options => options.MapFrom(source => source.TenDonVi));

            //add M_DanhMuc_MatHang
            CreateMap<AddDanhMucRequest, M_DanhMuc_MatHang>().ReverseMap();
            CreateMap<UpdateDanhMucRequest, M_DanhMuc_MatHang>().ReverseMap();

            //add M_MatHang
            CreateMap<AddMatHangRequest, M_MatHang>()
            .ForMember(destination => destination.Gia_Von, options => options.MapFrom(source => decimal.Parse(source.Gia_Von)))
            .ForMember(destination => destination.Gia_Ban, options => options.MapFrom(source => decimal.Parse(source.Gia_Ban)));

            CreateMap<UpdateMatHangRequest, M_MatHang>().ReverseMap();
            CreateMap<ImportProductRequest, M_MatHang>().ReverseMap();

            //add M_DonVi_MatHang
            CreateMap<AddDonViMatHangRequest, M_DonVi_MatHang>().ReverseMap();
            CreateMap<UpdateDonViMatHangRequest, M_DonVi_MatHang>().ReverseMap();
            CreateMap<AddOutletRequest, M_Outlet>().ReverseMap();

            //add M_ThucDon
            CreateMap<AddThucDonRequest, M_ThucDon>().ReverseMap();
            CreateMap<UpdateThucDonRequest , M_ThucDon>().ReverseMap();

            //add M_ThucDonMH
            CreateMap<AddThucDonMHRequest, M_ThucDon_MatHang>().ReverseMap();
            CreateMap<M_MatHang, MatHangModelRespose>()
            .ForMember(destination => destination.Id, options => options.MapFrom(source => source.Ma_MH))
            .ForMember(destination => destination.Id_LoaiMH, options => options.MapFrom(source => source.Loai_MH));
            
            CreateMap<M_ThucDon, ThucDonModelResponse>().ForMember(destination => destination.Id, options => options.MapFrom(source => source.Ma_TD));

            //add M_MatHang
            CreateMap<AddNhomQuyenRequest, M_NhomQuyen>().ReverseMap();
            CreateMap<AddNhomQuyenRequest, M_NhomQuyen_ChucNang>().ReverseMap();

            //add Printer
            CreateMap<AddPrinterRequest, M_Printer>().ReverseMap();
            CreateMap<UpdatePrinterRequest, M_Printer>().ReverseMap();

            //add NhanVien
            CreateMap<AddNhanVienRequest, M_User>().ReverseMap();
            CreateMap<UpdateNhanVienRequest, M_User>().ReverseMap();

            // DanhMucThuChi
            CreateMap<AddDanhMucThuChiRequest, M_DanhMuc_ThuChi>().ReverseMap();
            CreateMap<UpdateDanhMucThuChiRequest, M_DanhMuc_ThuChi>().ReverseMap();

            //PhieuThuChi
            CreateMap<AddPhieuThuChiRequest, T_PhieuThuChi>()
                .ForMember(destination => destination.ThoiGianGhiNhan, options => options.MapFrom(source => DateTime.Parse(source.ThoiGianGhiNhan)));
            CreateMap<UpdatePhieuThuChiRequest, T_PhieuThuChi>()
                .ForMember(destination => destination.ThoiGianGhiNhan, options => options.MapFrom(source => DateTime.Parse(source.ThoiGianGhiNhan)));

            //add KhachHang
            CreateMap<AddKhachHangRequest, M_KhachHang>() 
                .ForMember(destination => destination.NgaySinh_KH, options => options.MapFrom(source => DateTime.Parse(source.NgaySinh_KH))); 
			CreateMap<AddKhachHangRequest, M_Nhom_KhachHang>().ReverseMap();
            CreateMap<UpdateKhachHangRequest, M_KhachHang>().ReverseMap();

            //add NhomKhachHang
            CreateMap<AddNhomKhachHangRequest, M_Nhom_KhachHang>().ReverseMap();
            CreateMap<UpdateNhomKhachHangRequest, M_Nhom_KhachHang>().ReverseMap();
            CreateMap<UpdateKhachHangByIRequest, M_KhachHang>().ReverseMap();
            CreateMap<M_KhachHang, KhachHangModelResponse>().ReverseMap();

            // Map HTTT
            CreateMap<M_HinhThucThanhToan, HinhThucTTResponse>().ReverseMap();
            CreateMap<M_Data, HinhThucTTResponse>()
                .ForMember(destination => destination.MaHinhThucThanhToan, options => options.MapFrom(source => source.No))
                .ForMember(destination => destination.TenHinhThucThanhToan, options => options.MapFrom(source => source.Data));

            CreateMap<PaymentOrderedRequest, T_ThanhToan>()
                .ForMember(destination => destination.Sort, options => options.MapFrom(source => source.Id));

            //add theThanhVien
            CreateMap<AddTheThanhVienRequest, M_TheThanhVien>().ReverseMap();
            CreateMap<UpdateTheThanhVienRequest, M_TheThanhVien>().ReverseMap();
            CreateMap<UpdateTheKHByIRequest, M_KhachHang>().ReverseMap();

            //add khuyenMai
            CreateMap<AddKhuyenMaiRequest, M_KhuyenMai>().ReverseMap();
            CreateMap<AddKhuyenMaiRequest, M_KhuyenMai_ApDung>().ReverseMap();
            CreateMap<AddKhuyenMaiRequest, M_KhuyenMai_DoiTuong>().ReverseMap();
            CreateMap<AddKhuyenMaiRequest, M_KhuyenMai_KhoangThoiGian>().ReverseMap();

            CreateMap<UpdateKhuyenMaiRequest, M_KhuyenMai>().ReverseMap();
            CreateMap<UpdateKhuyenMaiRequest, M_KhuyenMai_ApDung>().ReverseMap();
            CreateMap<UpdateKhuyenMaiRequest, M_KhuyenMai_KhoangThoiGian>().ReverseMap();
            CreateMap<UpdateKhuyenMaiRequest, M_KhuyenMai_DoiTuong>().ReverseMap();
            CreateMap<BillResponse, T_DonHang>().ReverseMap();
            CreateMap<ItemMatHangDH, T_DonHangChiTiet>().ReverseMap();
            CreateMap<PhieuNXRequest, T_PhieuNhapXuat>().ReverseMap();
            CreateMap<PhieuNXRequest, T_PhieuNhapXuat_ChiTiet>().ReverseMap();
            CreateMap<PhieuNXRequest, T_LichSu_MatHang>().ReverseMap();
            CreateMap<UpdatePhieuNXRequest, T_PhieuNhapXuat>().ReverseMap();

            //add HinhThucThanhToan
            CreateMap<AddHinhThucTTRequest, M_HinhThucThanhToan>().ReverseMap();
            CreateMap<UpdateHinhThucTTRequest, M_HinhThucThanhToan>().ReverseMap();

            CreateMap<AddHoSoNVRequest, M_NhanVien>().ReverseMap();
            CreateMap<AddHoSoNVRequest, M_NhanVien_HoSo>().ReverseMap();
            CreateMap<M_NhanVien_HoSo, FileHoSoNhanVienModelResponse>().ReverseMap();

            //add CaLamViec
            CreateMap<CaLamViecRequest, M_CaLamViec>().ReverseMap();
            CreateMap<UpdateCaLamViecRequest, M_CaLamViec>().ReverseMap();

            CreateMap<M_CaLamViec, CaLamViecModelResponse>().ReverseMap();
            CreateMap<M_Data, CaLamViecModelResponse>()
                .ForMember(destination => destination.So_CaLamViec, options => options.MapFrom(source => source.No))
                .ForMember(destination => destination.Ma_CaLamViec, options => options.MapFrom(source => source.Code))
                .ForMember(destination => destination.MoTa_CaLamViec, options => options.MapFrom(source => source.Data));

            //add M_NhanVien_HeSo
            CreateMap<AddNhanVienHeSoCoRequest, M_NhanVien_HeSo>().ReverseMap();
            CreateMap<AddLichSuCongTacRequest, T_LichCongTac_NhanVien>().ReverseMap();
            CreateMap<UpdateLichCongTacRequest, T_LichCongTac_NhanVien>().ReverseMap();

            //T_Luong
            CreateMap<UpdateLuongNVRequest, T_Luong>().ReverseMap();
            CreateMap<M_Printer, PrinterModelResponse>().ReverseMap();
        }
    }
}
