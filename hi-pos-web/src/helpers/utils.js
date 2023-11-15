export function hasChildren(item) {
  const { items: children } = item;

  if (!item.isAuth) {
    return false;
  }

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }

  return true;
}

export function isValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const API_URL = "http://localhost:5288/api/";
// export const API_URL = "http://api.himon.vn/api/";

export function formatMoney(n, currency) {
  if (!n) {
    n = 0;
  }
  return (n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")).replace(".00", "") + "" + (currency ? currency : "");
}


export const ConvertObjectToFormData = (object,
  formData = new FormData(),
  namespace = undefined) => {
  for (let property in object) {
    if (!object.hasOwnProperty(property) || !object[property]) {
      continue;
    }
    const formKey = namespace ? `${namespace}[${property}]` : property;
    if (object[property] instanceof Date) {
      formData.append(formKey, object[property].toISOString());
    } else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
      ConvertObjectToFormData(object[property], formData, formKey);
    } else {
      formData.append(formKey, object[property]);
    }
  }
  return formData;
}
export function ToFormData(object, formData = new FormData(), namespace = undefined) {
  for (let property in object) {
    if (!object.hasOwnProperty(property) || !object[property]) {
      continue;
    }
    const formKey = namespace ? `${namespace}[${property}]` : property;
    if (object[property] instanceof Date) {
      formData.append(formKey, object[property].toISOString());
    } else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
      ToFormData(object[property], formData, formKey);
    } else {
      formData.append(formKey, object[property]);
    }
  }
  return formData;
}

const ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
const Tien = new Array("", " nghìn", "triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

const docSo3ChuSo = (baso) => {
  var tram;
  var chuc;
  var donvi;
  var KetQua = "";
  tram = parseInt(baso / 100);
  chuc = parseInt((baso % 100) / 10);
  donvi = baso % 10;
  if (tram === 0 && chuc === 0 && donvi === 0) return "";
  if (tram !== 0) {
    KetQua += ChuSo[tram] + " trăm ";
    if ((chuc === 0) && (donvi !== 0)) KetQua += " linh ";
  }
  if ((chuc !== 0) && (chuc !== 1)) {
    KetQua += ChuSo[chuc] + " mươi";
    if ((chuc === 0) && (donvi !== 0)) KetQua = KetQua + " linh ";
  }
  if (chuc === 1) KetQua += " mười ";
  switch (donvi) {
    case 1:
      if ((chuc !== 0) && (chuc !== 1)) {
        KetQua += " mốt ";
      }
      else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc === 0) {
        KetQua += ChuSo[donvi];
      }
      else {
        KetQua += " lăm ";
      }
      break;
    default:
      if (donvi !== 0) {
        KetQua += ChuSo[donvi];
      }
      break;
  }
  return KetQua;
}
export const DocTienBangChu = (SoTien) => {
  var lan = 0;
  var i = 0;
  var so = 0;
  var KetQua = "";
  var tmp = "";
  var soAm = false;
  var ViTri = new Array();
  if (SoTien < 0) soAm = true;//return "Số tiền âm !";
  if (SoTien === 0) return "Không đồng";//"Không đồng !";
  if (SoTien > 0) {
    so = SoTien;
  }
  else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    //SoTien = 0;
    return "";//"Số quá lớn!";
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  if (isNaN(ViTri[5]))
    ViTri[5] = "0";
  so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  if (isNaN(ViTri[4]))
    ViTri[4] = "0";
  so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  if (isNaN(ViTri[3]))
    ViTri[3] = "0";
  so = so - parseFloat(ViTri[3].toString()) * 1000000000;
  ViTri[2] = parseInt(so / 1000000);
  if (isNaN(ViTri[2]))
    ViTri[2] = "0";
  ViTri[1] = parseInt((so % 1000000) / 1000);
  if (isNaN(ViTri[1]))
    ViTri[1] = "0";
  ViTri[0] = parseInt(so % 1000);
  if (isNaN(ViTri[0]))
    ViTri[0] = "0";
  if (ViTri[5] > 0) {
    lan = 5;
  }
  else if (ViTri[4] > 0) {
    lan = 4;
  }
  else if (ViTri[3] > 0) {
    lan = 3;
  }
  else if (ViTri[2] > 0) {
    lan = 2;
  }
  else if (ViTri[1] > 0) {
    lan = 1;
  }
  else {
    lan = 0;
  }
  for (i = lan; i >= 0; i--) {
    tmp = docSo3ChuSo(ViTri[i]);
    KetQua += tmp;
    if (ViTri[i] > 0) KetQua += Tien[i];
    if ((i > 0) && (tmp.length > 0)) KetQua += '';//',';//&& (!string.IsNullOrEmpty(tmp))
  }
  if (KetQua.substring(KetQua.length - 1) == ',') {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
  if (soAm) {
    return "Âm " + KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
  }
  else {
    return KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
  }
}

// Format text bar chart
export const innerBarText = {
  id: 'innerBarText',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const {ctx, data, chartArea: {left }, scales: {x,y}} = chart;
    ctx.save();
    data.datasets[0].data.forEach((dataPoint, index) => {
      ctx.font = 'border 10px san-serif';
      ctx.fillStyle = 'black';
      ctx.fillText(`${formatMoney(dataPoint)}`, left + 10, y.getPixelForValue(index))
    })
  }
}

export const removeVietnameseTones = (str, characters) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g," ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  if(characters) {
    return str.toLowerCase().replaceAll(" ", '-');
  }
  return str.toLowerCase();
}