using System.ComponentModel;

namespace Pos.API.Constans
{
    /// <summary>
    /// Common Context for define some text
    /// </summary>
    public static class CmContext
    {
        public enum GOI_DICH_VU
        {
            [Description("FREE00")]
            FREE = 28
        }

        public enum TINH_TRANG_DON_VI
        {
            [Description("1")]
            DE_XUAT = 13
        }

        public enum GROUP_DATA
        {
            [Description("PACKAGE")]
            PACKAGE,

            [Description("TTDONVI")]
            TTDONVI,

            [Description("NHOMSALE")]
            NHOMSALE,

            [Description("NGANHHANG")]
            NGANHHANG,

            [Description("LOAIMATHANG")]
            LOAIMATHANG,

            [Description("LOAIDONHANG")]
            LOAIDONHANG,

			[Description("CHUCNANG")]
            CHUCNANG,

            [Description("LOAIDANHMUCTHUCHI")]
            LOAIDANHMUCTHUCHI,

            [Description("HINHTHUCTHANHTOAN")]
            HINHTHUCTHANHTOAN,

            [Description("TINHTRANGDONHANG")]
            TINHTRANGDONHANG,

             [Description("LOAIPHIEU")]
             LOAIPHIEU,
            [Description("LOAIKHACHHANG")]
            LOAIKHACH,
            [Description("CALAMVIEC")]
            CALAMVIEC
        }
        public enum TYPE_DATA
        {
            [Description("DANGKY")]
            DANGKY,
            [Description("BANHANG")]
            BANHANG,
            [Description("THIETLAP")]
            THIETLAP,
            [Description("THUCHI")]
            THUCHI,
            [Description("BAOCAO")]
            BAOCAO,
            [Description("MATHANG")]
            MATHANG,
            [Description("KHOHANG")]
            KHOHANG,
            [Description("DOITUONG")]
            DOITUONG,
            [Description("PHONGBAN")]
            PHONGBAN,
            [Description("TINHTRANGHOSONHANVIEN")]
            TINHTRANGHOSONHANVIEN,
            [Description("LOAIHOSONHANVIEN")]
            LOAIHOSONHANVIEN,
            [Description("TRINHDO")]
            TRINHDO,
        }

        public enum TINHTRANGDONHANG
        {
            BAN_TRONG = 0,
            TAO_DON_HANG = 1,
            HOAN_THANH_DON_HANG = 2,
            HUY_DON_HANG = 3
        }

        public enum LOAI_MAT_HANG
        {
            TINH_TIEN_THEO_SO_LUONG = 102,
            TINH_TIEN_THEO_TRONG_LUONG = 103,
            TINH_TIEN_THEO_THOI_GIAN = 104
        }

        public enum GIA_TRI_CHIET_KHAU
        {
            PHAN_TRAM = 1,
            SO_TIEN = 2
        }

        public enum LOAI_CHIET_KHAU
        {
            CHIET_KHAU_BILL_BINH_THUONG = 0,
            CHIET_KHAU_BILL = 1,
            CHIET_KHAU_MH = 2,
            CHIET_KHAU_BILL_MH = 3,
        }
        public enum POSITION_DEFAULT
        {
            X = 10,
            Y = 10,
        }

        public enum LOAI_DON_HANG
        {
            DUNG_TAI_BAN = 81,
            DUNG_MANG_DI = 82,
        }

        public enum LOAI_PHIEU_THU_CHI
        {
            PHIEU_THU = 1,
            PHIEU_CHI = 2,
        }

        public enum LOAI_THOI_GIAN_AP_DUNG
        {
            PHUT = 1,
            GIO = 2,
            MGAY = 3
        }
    }
}
