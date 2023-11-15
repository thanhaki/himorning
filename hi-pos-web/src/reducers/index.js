import { combineReducers } from "redux";
import message from "./message";
import auth from "./auth";
import donvi from "./donvi";
import mdata from "./mdata";
import setupTbl from "./setup-table";
import thucdon from "./thucdon";
import outlet from "./outlet";
import product from "./product";
import printer from "./printer";
import customer from "./customer";
import khachhang from "./khachhang";
import thethanhvien from "./thethanhvien";

export default combineReducers({
  message,
  auth,
  donvi,
  mdata,
  setupTbl,
  thucdon,
  outlet,
  product,
  printer,
  customer,
  khachhang,
  thethanhvien
});