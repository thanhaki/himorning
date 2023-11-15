import { FORMAT_HH_MM_DD_MM_YYYY, GIA_TRI_CHIET_KHAU, TINH_TIEN_THEO_THOI_GIAN, FORMAT_DD_MM_YYYY } from "../../consts/constsCommon";
import { formatMoney } from "../../helpers/utils";
import moment from 'moment';

export function calculatorAmountAfterChietKhau(row, datePayment) {
  if (!row.gia_Ban) return 0;
  const ck = row.chietKhau;
  var total = (row.gia_Ban * row.soLuong);
  var amount = total;

  if (row.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN && row.gioVao) {
    var time = returnTimeUsed(row, datePayment);
    total = row.giaMoiPhut * time;
  }

  if (ck) {
    ck.valueCk = (ck.valueCk + "").replace(/\D/g, '');
    const value = parseFloat(ck.valueCk);
    if (ck.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
      amount = total - value;
    }

    if (ck.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
      amount = total - ((total * value) / 100);
    }
  }
  return parseInt(amount);
}

export function returnTimeUsed(row, datePayment) {
  if (row) {
    if (!row.gioRa && !datePayment) {
      return 1;
    }

    var end = moment(new Date());
    if (row.gioRa) {
      end = moment(row.gioRa);
    } else {
      if (datePayment) {
        end = datePayment;
      }
    }

    var start = moment(row.gioVao);

    var endSeconds = end.seconds();
    end = end.add(-endSeconds, 'second');

    var duration = moment.duration(end.diff(start));
    var time = duration.asMinutes();
    return time;
  }
}

export function returnAmountNotCkBill(orderNewList, datePayment) {
  if (orderNewList) {
    const initialValue = 0;
    const sumWithInitial = orderNewList.reduce((accumulator, currentValue) => {
      return accumulator + calculatorAmountAfterChietKhau(currentValue, datePayment);
    }, initialValue);
    return sumWithInitial;
  }
  return 0;
}

export function returnChietKhauBill(chietKhau, amount) {
  let ck = 0;
  if (chietKhau && chietKhau.valueCk) {
    chietKhau.valueCk = (chietKhau.valueCk + "").replace(/\D/g, '');
    const value = parseFloat(chietKhau.valueCk)
    if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
      ck = value;
    };

    if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
      ck = (amount * value) / 100;
    };
  }
  return ck;
}

export function calculatorChietKhauRow(row, tienGiamGia_DH) {
  const ck = row.chietKhau;
  if (ck) {

    ck.valueCk = (ck.valueCk + "").replace(/\D/g, '');
    const value = parseFloat(ck.valueCk)

    if (ck.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
      if (tienGiamGia_DH) {
        return formatMoney(value + tienGiamGia_DH);
      } else {
        return formatMoney(value);
      }
    }

    if (ck.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
      let total = 1;
      if (row.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN) {
        total = row.totalMinus * row.giaMoiPhut;
      } else {
        total = (row.gia_Ban * row.soLuong);
      }
      return ck.valueCk + '% (' + formatMoney((total * value) / 100, 'đ') + ') ';
    }
  }
}

export function returnAmountMHTheoGio(orderNewList) {
  if (orderNewList) {
    const initialValue = 0;
    const sumWithInitial = orderNewList.reduce((accumulator, currentValue) => {
      if (currentValue.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN && (!currentValue.gioVao || !currentValue.gioRa)) {
        return accumulator + currentValue.gia_Ban;
      }
      return accumulator;
    }, initialValue);
    return sumWithInitial;
  }
  return 0;
}

export function returnFormatTimeUsed(row, datePayment) {
  if (row) {
    if (!row.gioRa && !datePayment) {
      return "1 Phút";
    }

    var end = moment(new Date());
    if (row.gioRa) {
      end = moment(row.gioRa);
    } else {
      if (datePayment) {
        end = moment(datePayment);
      }
    }

    var start = moment(row.gioVao);

    var endSeconds = end.seconds();
    end = end.add(-endSeconds, 'second');

    var duration = moment.duration(end.diff(start));

    var minutes = duration.asMinutes();
    if (minutes < 60) {
      return  minutes < 1 ? "1 Phút" : Math.round(minutes) + " Phút";
    } else {
      var hour = parseInt(minutes / 60);
      return hour + " Giờ " + Math.round(minutes - 60 * hour) + " Phút";
    }
  }
}
export function thoiGianTamTinh(matHang) {
  if (matHang?.gioRa) {
    return moment(matHang?.gioRa).format(FORMAT_HH_MM_DD_MM_YYYY);
  } else {
    return moment(new Date()).format("HH:mm") + " - " + moment(new Date()).format(FORMAT_DD_MM_YYYY)
  }
}