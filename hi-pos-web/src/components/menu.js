import React from "react";
import CategoryIcon from '@mui/icons-material/Category';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SettingsIcon from '@mui/icons-material/Settings';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaidIcon from '@mui/icons-material/Paid';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { colors } from "@mui/material";
import { pink } from "@mui/material/colors";
import VerifiedIcon from '@mui/icons-material/Verified';
// import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
const isUserAuth = JSON.parse(localStorage.getItem('user'));

export const menu = [
  {
    icon: <DashboardIcon  color="success"/>,
    title: "Trang Chủ",
    isAuth: isUserAuth,
    to: '/',
    no: 1150,
  },
  // {
  //   icon: <PsychologyAltIcon />,
  //   title: "Hướng Dẫn SỬ Dụng HiMorning",
  //   isAuth: isUserAuth,
  //   to: '/introduction',
  //   no: 1156
  // },
  {
    icon: <StorefrontIcon color="primary"/>,
    title: "Bán hàng",
    isAuth: isUserAuth,
    no: 1142,
    items: [
      {
        title: "- Tạo hóa đơn",
        to: '/map-table',
        isAuth: isUserAuth,
        no: 64,
      },
      {
        title: "- Quản lý hóa đơn",
        to: '/quan-ly-don-hang',
        isAuth: isUserAuth,
        no: 67,
      },
    ]
  },
  {
    icon: <PaidIcon sx={{ color: pink[500] }}/>,
    title: "Thu chi",
    isAuth: isUserAuth,
    no: 1143,
    items: [
      {
        title: "- Phiếu thu",
        to: '/phieuthu',
        isAuth: isUserAuth,
        no: 62
      },
      {
        title: "- Phiếu chi",
        to: '/phieuchi',
        isAuth: isUserAuth,
        no: 62
      },
      {
        title: "- Danh mục thu chi",
        to: '/danhmuc-thuchi',
        isAuth: isUserAuth,
        no: 63
      },
    ]
  },
  {
    icon: <PrecisionManufacturingIcon color="primary"/>,
    title: "Kho hàng",
    isAuth: isUserAuth,
    no: 1144,
    items: [
      {
        title: "- Danh sách tồn kho",
        to: '/ton-kho',
        isAuth: isUserAuth,
        no: 57,
      },
      {
        title: "- Nhập kho",
        to: '/nhap-kho',
        isAuth: isUserAuth,
        no: 58,
      },
      {
        title: "- Xuất kho",
        to: '/xuat-kho',
        isAuth: isUserAuth,
        no: 59,
      },
      {
        title: "- Kiểm kê",
        to: '/kiem-ke',
        isAuth: isUserAuth,
        no: 60,
      },
      {
        title: "- Lịch sử kho",
        to: '/lich-su-kho',
        isAuth: isUserAuth,
        no: 61,
      },
    ]
  },
  {
    icon: <CategoryIcon color="primary"/>,
    title: "Mặt Hàng",
    isAuth: isUserAuth,
    no: 1145,
    items: [
      {
        title: "- Danh mục",
        to: '/categories',
        isAuth: isUserAuth,
        no: 47
      },
      {
        title: "- Đơn vị",
        to: '/ProductUnits',
        isAuth: isUserAuth,
        no: 49
      }
      ,
      {
        title: "- Mặt hàng",
        to: '/products',
        isAuth: isUserAuth,
        no: 50
      },
      {
        title: "- Thực đơn",
        to: '/listMenus',
        isAuth: isUserAuth,
        no: 48
      }
    ]
  },
  {
    icon: <AcUnitIcon color="primary"/>,
    title: "Tài khoản",
    isAuth: isUserAuth,
    no: 1146,
    items: [
      {
        title: "Danh sách đơn vị",
        to: '/units',
        isAuth: isUserAuth,
        no: 46,
      }
    ]
  },
  {
    icon: <ManageAccountsIcon color="primary"/>,
    title: "Nhân viên",
    isAuth: isUserAuth,
    no: 1147,
    items: [
      {
        title: "- Danh sách nhân viên",
        to: '/nhan-vien',
        isAuth: isUserAuth,
        no: 51
      },
      {
        title: "- Vai trò nhân viên",
        to: '/groups',
        isAuth: isUserAuth,
        no: 52
      },
    ]
  },
  {
    icon: <ManageAccountsIcon color="primary"/>,
    title: "Khách hàng",
    isAuth: isUserAuth,
    no: 1157,
    items: [
      {
        title: "- Danh sách khách hàng",
        to: '/khach-hang',
        isAuth: isUserAuth,
        no: 53
      },
      {
        title: "- Nhóm khách hàng",
        to: '/nhom-khachhang',
        isAuth: isUserAuth,
        no: 54
      },
      {
        title: "- Thẻ thành viên",
        to: '/the-thanh-vien',
        isAuth: isUserAuth,
        no: 55
      },
      {
        title: "- Khuyến mãi",
        to: '/khuyen-mai',
        isAuth: isUserAuth,
        no: 56
      },
    ]
  },
  {
    icon: <GroupsRoundedIcon color="primary"/>,
    title: "Nhân sự",
    isAuth: isUserAuth,
    no: 1151,
    items: [
      {
        title: "- Hồ sơ nhân viên",
        to: '/hoso-nhanvien',
        isAuth: isUserAuth,
        no: 1152
      },
      {
        title: "- Lịch làm việc",
        to: '/lich-lam-viec#',
        isAuth: isUserAuth,
        no: 1153
      },
      {
        title: "- Bảng lương nhân viên",
        to: '/luong-nhanvien',
        isAuth: isUserAuth,
        no: 1153
      },
      {
        title: "- Hệ số nhân viên",
        to: '/heso-nhanvien',
        isAuth: isUserAuth,
        no: 1154
      },
      {
        title: "- Định nghĩa ca làm việc",
        to: '/ca-lam-viec',
        isAuth: isUserAuth,
        no: 1155
      },
    ]
  },
  {
    icon: <AssessmentIcon color="secondary"/>,
    title: "Báo cáo",
    isAuth: isUserAuth,
    no: 1148,
    items: [
      {
        title: "- Báo cáo tài chính",
        to: '/report/taichinh',
        isAuth: isUserAuth,
        no: 75,
      },
      {
        title: "- Báo cáo doanh thu",
        to: '/report/doanhthu',
        isAuth: isUserAuth,
        no: 72
      },
      {
        title: "- Báo cáo mặt hàng",
        to: '/report/mathang',
        isAuth: isUserAuth,
        no: 73,
      },
      // {
      //   title: "Báo cáo kho hàng",
      //   to: '#',
      //   isAuth: isUserAuth,
      //   no: 74,
      // },
      // {
      //   title: "Báo cáo khuyễn mại",
      //   to: '#',
      //   isAuth: isUserAuth,
      //   no: 76,
      // },
      // {
      //   title: "Báo cáo nhân viên",
      //   to: '#',
      //   isAuth: isUserAuth,
      //   no: 77,
      // },
      // {
      //   title: "Báo cáo công nợ",
      //   to: '#',
      //   isAuth: isUserAuth,
      //   no: 79,
      // },
    ]
  },
  {
    icon: <SettingsIcon color="primary"/>,
    title: "Thiết lập",
    isAuth: isUserAuth,
    no: 1149,
    items: [
      {
        title: "- Thông tin đơn vị",
        to: '/edit-unit',
        isAuth: isUserAuth,
        no: 44
      },
      // {
      //   title: "Master Data",
      //   to: '/',
      //   isAuth: isUserAuth,
      //   no: 108
      // },
      {
        title: "- Thiết lập khu vực bán",
        to: '/outlets',
        isAuth: isUserAuth,
        no: 70
      },
      {
        title: "- Thiết lập máy in",
        to: '/printer',
        isAuth: isUserAuth,
        no: 68
      },
      {
        title: "- Phương thức thanh toán",
        to: '/phuong-thuc-thanhtoan',
        isAuth: isUserAuth,
        no: 68
      },
      {
        title: "- Thiết lập ngôn ngữ",
        to: '/setup-language',
        isAuth: isUserAuth,
        no: 40
      },
      {
        title: "- Thiết lập hình ảnh",
        to: '/setup-image',
        isAuth: isUserAuth,
        no: 0
      },
    ]
  },
  {
    icon: <PrivacyTipOutlinedIcon color="primary"/>,
    title: "Hướng dẫn",
    isAuth: isUserAuth,
    no: 1158,
    items: [
      {
        title: "- Bán hàng",
        to: '/HuongDan-ThietLap-BanHang',
        isAuth: isUserAuth,
        no: 1159
      },
      {
        title: "- Thu chi",
        to: '/HuongDan-ThietLap-ThuChi',
        isAuth: isUserAuth,
        no: 1160
      },
      // {
      //   title: "Kho hàng",
      //   to: '/#',
      //   isAuth: isUserAuth,
      //   no: 1161
      // },
      {
        title: "- Nhân sự",
        to: '/HuongDan-ThietLap-NhanSu',
        isAuth: isUserAuth,
        no: 1162
      },
    ]
  },
  {
    icon: <VerifiedIcon color="success"/>,
    title: "Version: 10230910",
    isAuth: isUserAuth,
  },
];
