import { Route, Routes } from 'react-router-dom';
import Introduction from './components/huong-dan-su-dung/introduction.component';
import IntroductionHR from './components/huong-dan-su-dung/introductHRAM.component';
import IntroductionThuChi from './components/huong-dan-su-dung/introductThuChi.component';
import Layout from "./components/layout";
import SignUp from "./components/don-vi/signUp.component";
import SignIn from "./components/don-vi/signIn.component";
import ForgotPassword from "./components/don-vi/forgotPassword.component";
import ConfirmIdentity from "./components/don-vi/confirm.component";
import ListDonVi from "./components/don-vi/listdv.component";
import ListCategory from "./components/danh-muc/listCategory.component";
import Product from './components/mat-hang/listProDuct.component';
import ProductUnit from './components/donvi-mathang/productUnits.component';
import SetupTable from './components/setup-table/setup-table.component';
import ListOutlet from './components/outlet/list-oulet.component';
import ListMenu from './components/thuc-don/listMenu.component';
import MapTable from './components/map-table/map-table.component';
import PostBill from './components/post-bill/postbill.component';
import GroupRights from './components/nhom-quyen/groups.component';
import Printer from './components/Printer/listPrinter.component';
import ListDanhMucThuChi from './components/danhmuc-thuchi/listDanhMucThuChi.component';
import ListNhanVien from './components/nhan-vien/listNhanVien.component';
import ListNhomKhachHang from './components/nhom-khachhang/listNhomKhachHang.component'
import ListPhieuThuChi from './components/phieuthu-phieuchi/danhsach.component';
import ListKhachHang from './components/khach-hang/listKhachHang.component'
import ListTheThanhVien from './components/the-thanh-vien/listTheThanhVien.component'
import ListKhuyenMai from './components/khuyen-mai/listKhuyenMai.component'
import QuanLyDonHang from './components/post-bill/qly-donhang.component'
import PhieuNhapKho from './components/nhap-kho/phieuNhapKho.component'
import PhieuXuatKho from './components/nhap-kho/phieuXuatKho.component'
import PhieuKiemKe from './components/nhap-kho/phieuKiemKe.component'
import LichSuKho from './components/nhap-kho/lichSuKho.component'
import DanhSachTonKho from './components/nhap-kho/tonKho.component'
import EditDonVi from "./components/don-vi/edit.component";
import BaoCaoDoanhthu from "./components/report/doanhthu.component";
import BaoCaoMatHang from "./components/report/mathang.component";
import BaoCaoTaiChinh from "./components/report/taichinh.component";
import PhuongThucTT from "./components/phuong-thuc-thanhtoan/listPhuongThucThanhT.component";
import SetUpImages from "./components/don-vi/setup-image.component";
import SetUpLanguage from "./components/don-vi/language.component";
import ListHoSoNhanVien from "./components/hoso-nhanvien/listHoSoNhanVien.component";
import ListWorfkShift from "./components/ca-lam-viec/listWordShift.component";
import ListHeSoNhanVien from "./components/heso-nhanvien/listHeSoNhanVien.component";
import PrintTempate from './components/print-templates/print-function-common'
import './translation/i18n';
import LichLamViecNhanVien from "./components/lich-lam-viec/listLichLamViec.component";
import ElectronicMenu from "./components/mat-hang/electronic/electronic-menu.component";
import ElectronicDetail from "./components/mat-hang/electronic/electronic-detail.component";
import ListLuongNhanVien from "./components/luong-nhanvien/listLuongNhanVien.component"
import PrintLuongNhanVienById from "./components/luong-nhanvien/print-templates/print-luongNv.component";
import PrintListLuongMotNhanVien from "./components/luong-nhanvien/print-templates/print-listLuongNv.component";
import { PATH_NO_LAYOUT } from './consts/constsCommon';
import VnPay from './components/payment/vnpay.component'
function App() {

  const AppRoutes = [
    {
      path: '/',
      element: <BaoCaoDoanhthu />
    },
    {
      path: '/HuongDan-ThietLap-BanHang',
      element: <Introduction />
    },
    {
      path: '/HuongDan-ThietLap-NhanSu',
      element: <IntroductionHR />
    },
    {
      path: '/HuongDan-ThietLap-ThuChi',
      element: <IntroductionThuChi />
    },
    {
      path: 'sign-up',
      element: <SignUp />
    },
    {
      path: 'sign-in',
      element: <SignIn />
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />
    },
    {
      path: 'confirm',
      element: <ConfirmIdentity />
    },
    {
      path: 'categories',
      element: <ListCategory />
    },
    {
      path: 'Products',
      element: <Product />
    },
    {
      path: 'ProductUnits',
      element: <ProductUnit />
    },
    {
      path: 'ListMenus',
      element: <ListMenu />
    },
    {
      path: 'units',
      element: <ListDonVi />
    },
    {
      path: 'setup-table/:id',
      element: <SetupTable />
    },
    {
      path: 'outlets',
      element: <ListOutlet />
    },
    {
      path: 'map-table',
      element: <MapTable />
    },
    {
      path: 'vn-pay',
      element: <VnPay />
    },
    {
      path: 'post-bill',
      element: <PostBill />
    },
    {
      path: 'groups',
      element: <GroupRights />
    },
    {
      path: 'Printer',
      element: <Printer />
    },
    {
      path: 'danhmuc-thuchi',
      element: <ListDanhMucThuChi />
    },
    {
      path: 'nhan-vien',
      element: <ListNhanVien />
    },
    {
      path: 'phieuthu',
      element: <ListPhieuThuChi loaiPhieuThuChi={1} />
    },
    {
      path: 'phieuchi',
      element: <ListPhieuThuChi loaiPhieuThuChi={2} />
    },
    {
      path: 'nhom-khachhang',
      element: <ListNhomKhachHang />
    },
    {
      path: 'khach-hang',
      element: <ListKhachHang />
    },
    {
      path: 'the-thanh-vien',
      element: <ListTheThanhVien />
    },
    {
      path: 'khuyen-mai',
      element: <ListKhuyenMai />
    },
    {
      path: 'hoso-nhanvien',
      element: <ListHoSoNhanVien />
    },
    {
      path: 'ca-lam-viec',
      element: <ListWorfkShift />
    },
    {
      path: 'quan-ly-don-hang',
      element: <QuanLyDonHang />
    },
    {
      path: 'nhap-kho',
      element: <PhieuNhapKho />
    },
    {
      path: 'xuat-kho',
      element: <PhieuXuatKho />
    },
    {
      path: 'kiem-ke',
      element: <PhieuKiemKe />
    },
    {
      path: 'lich-su-kho',
      element: <LichSuKho />
    },
    {
      path: 'ton-kho',
      element: <DanhSachTonKho />
    },
    {
      path: 'edit-unit',
      element: <EditDonVi />
    },
    {
      path: 'report/doanhthu',
      element: <BaoCaoDoanhthu />
    },
    {
      path: 'report/mathang',
      element: <BaoCaoMatHang />
    },
    {
      path: 'report/taichinh',
      element: <BaoCaoTaiChinh />
    },
    {
      path: 'phuong-thuc-thanhtoan',
      element: <PhuongThucTT />
    },
    {
      path: 'setup-image',
      element: <SetUpImages />
    },
    {
      path: 'setup-language',
      element: <SetUpLanguage />
    },
    {
      path: 'heso-nhanvien',
      element: <ListHeSoNhanVien />
    },
    {
      path: 'print-template',
      element: <PrintTempate />
    },
    {
      path: 'lich-lam-viec',
      element: <LichLamViecNhanVien />
    },
    {
      path: '/store/:dv',
      element: <ElectronicMenu />,
    },
    {
      path: '/:name/:dv/:mh',
      element: <ElectronicDetail />,
      name: 'ElectronicDetail'
    },
    {
      path: 'luong-nhanvien',
      element: <ListLuongNhanVien />
    },
    {
      path: 'print-luongnv',
      element: <PrintLuongNhanVienById />
    },
    {
      path: 'print-listLuongNv',
      element: <PrintListLuongMotNhanVien />
    }
  ];
  return (<Routes>
    {AppRoutes.map((route, index) => {
      const { element, ...rest } = route;
      if (route.path === "/") {
        return (
          <Route key={index} {...rest} element={<Layout>{element}</Layout>} />
        );
      } else {
        if (PATH_NO_LAYOUT.includes(route.path)) {
          return (
            <Route
              key={index}
              {...rest}
              element={element}
            />
          );
        } else {
          return (
            <Route
              key={index}
              {...rest}
              element={<Layout name={element.name}>{element}</Layout>}
            />
          );
        }
      }
    })}
  </Routes>);
}

export default App;