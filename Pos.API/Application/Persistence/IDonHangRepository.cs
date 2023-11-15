using Pos.API.Models;
using Pos.API.Models.BaoCao;

namespace Pos.API.Application.Persistence
{
    public interface IDonHangRepository : IAsyncRepository<T_DonHang>
    {
        Task<OrderedList> GetTableOrdered(int tableId, int? donVi);
        Task<IEnumerable<BillResponse>> GetBills(int donVi, FilterBillRequest filter);
        Task<IEnumerable<HoaDonKHModelResponse>> GetHoaDonKhachHang(int donVi, int ma_KH);
        Task<DoanhThuTongQuanResponse> GetBaoCaoDoanhThuTongQuan(int donVi, string thoiGian, string from, string to);
        Task<DoanhThuHTTTResponse> GetBaoCaoDoanhThuHTTT(int donVi, string thoiGian, string from, string to);
        Task<DoanhThuThuNganResponse> GetBaoCaoDoanhThuNgan(int donVi, string thoiGian, string from, string to);
        Task<DoanhThuPhucVuResponse> GetBaoCaoDoanhThuPhucVu(int donVi, string thoiGian, string from, string to);
        Task<DoanhThuLoaiDHResponse> GetBaoCaoDoanhThuLoaiDH(int donVi, string thoiGian, string from, string to);
        Task<IEnumerable<DoanhThuDHHuyResponse>> GetBaoCaoDoanhThuDHHuy(int donVi, string thoiGian, string from, string to);
        Task<DanhMucMatHangResponse> GetBaoCaoDanhMucMH(int donVi, string thoiGian, string from, string to);
        Task<MatHangBanChayResponse> GetBaoCaoMHBanChay(int donVi, string thoiGian, string from, string to);
        Task<IEnumerable<MatHangDaHuyResponse>> GetBaoCaoMHDaHuy(int donVi, string thoiGian, string from, string to);
        Task<KetQuaKDResponse> GetBaoCaoKQKD(int donVi, string thoiGian, string from, string to);
        Task<IEnumerable<LoiNhuanTheoMHResponse>> GetBaoCaoLoiNhuanTheoMH(int donVi, string thoiGian, string from, string to);
        Task<OrderedList> GetTableOrderedNew(string maDh, int? donVi);
    }
}
