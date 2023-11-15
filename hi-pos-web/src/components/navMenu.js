import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { menu } from "./menu";
import { hasChildren } from "../helpers/utils";
import ListItemButton from "@mui/material/ListItemButton";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading, setTitle } from "../actions/index";
import donviService from '../services/donvi.service';
import TableService from '../services/table.service';
import { showMessageByType } from '../helpers/handle-errors';
import { TYPE_ERROR } from '../helpers/handle-errors';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

const NavMenu = (props) => {
  const dispatch = useDispatch();
  const [listLanguage, setListLanguage] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const [isReloadTC, setIsReloadTC] = useState(false);
  const [completed, setCompleted] = React.useState({});
  const [completedHR, setCompletedHR] = React.useState({});
  const [completedTC, setCompletedTC] = React.useState({});
  const ROLE_CODE = [108, 46, 40];

  useEffect(() => {
    getDataNNTheoNganhHang();
  }, []);

  const getTitleByNganhHang = (item) => {
    var lanuage = listLanguage.find(x => x.maChucNang === item.no);
    var title = (!lanuage || !lanuage.vietNamese) ? item.title : lanuage.vietNamese;
    return title;
  }

  const getDataNNTheoNganhHang = () => {
    var user = props.userInfo?.user
    dispatch(showLoading(true));
    donviService.getDataNgonNguTheoNganhHang(user.nganhHang).then(res => {
      setListLanguage(res.data)
      dispatch(hideLoading());
    }).catch(error => {
      dispatch(hideLoading());
    })
  }

  const MenuItem = ({ item, data }) => {
    if (item.isAuth) {
      if (hasChildren(item)) {
        return <MultiLevel item={item} />;
      } else {
        return <SingleLevel item={item} />
      }
    }
  };

  useEffect(() => {
    let data = props.userInfo?.user?.donVi;
    dispatch(showLoading(true));

    TableService.getResultCheckTheSalesGuideSection(data)
      .then((result) => {
        const newCompleted = {};
        result.data.forEach((value, index) => {
          if (value > 0) {
            newCompleted[index] = true;
          }
        });
        setCompleted(newCompleted);
        setIsReload(true);
      })
      .catch((error) => {
        showMessageByType(error, 'Lỗi lấy thông tin', TYPE_ERROR.error);
      })
      .finally(() => {
        dispatch(hideLoading());
      });
  }, []);

  useEffect(() => {
    async function fetchHRData() {
      if (isReload) {
        let data = props.userInfo?.user?.donVi;
        dispatch(showLoading(true));

        try {
          const result = await TableService.getResultCheckTheHRAdministrativeManual(data);
          const newCompletedHR = {};
          result.data.forEach((value, index) => {
            if (value > 0) {
              newCompletedHR[index] = true;
            }
          });
          setCompletedHR(newCompletedHR);
          setIsReloadTC(true);
        } catch (error) {
          showMessageByType(error, 'Lỗi lấy thông tin', TYPE_ERROR.error);
        } finally {
          dispatch(hideLoading());
        }
      }
    }

    fetchHRData();
  }, [isReload]);

  useEffect(() => {
    async function fetchTCData() {
      if (isReloadTC) {
        let data = props.userInfo?.user?.donVi;
        dispatch(showLoading(true));

        try {
          const result = await TableService.getResultGetResultCheckGuideToRevenueAndExpenditure(data);
          const newCompletedTC = {};
          result.data.forEach((value, index) => {
            if (value > 0) {
              newCompletedTC[index] = true;
            }
          });
          setCompletedTC(newCompletedTC);
        } catch (error) {
          showMessageByType(error, 'Lỗi lấy thông tin', TYPE_ERROR.error);
        } finally {
          dispatch(hideLoading());
        }
      }
    }

    fetchTCData();
  }, [isReloadTC]);

  const SingleLevel = ({ item }) => {
    const navigate = useNavigate();
    const handleClickMenu = (to) => {
      var lanuage = listLanguage.find(x => x.maChucNang === item.no);
      var title = (!lanuage || !lanuage.vietNamese) ? item.title : lanuage.vietNamese;
      console.log("title", title)
      dispatch(setTitle(title))
      navigate(to)
    }
    if ((item.no === 1159 && (!(completed[0] && completed[1] && completed[2] && completed[3] && completed[4] && completed[5] && completed[6] && completed[7] && completed[8] && completed[9]))) || (item.no === 1162 && (!(completedHR[0] && completedHR[1] && completedHR[2] && completedHR[3] && completedHR[4]))) || (item.no === 1160 && (!(completedTC[0] && completedTC[1] && completedTC[2] && completedTC[3] && completedTC[4])))) {
      return (
        <ListItem button>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={getTitleByNganhHang(item)} onClick={() => handleClickMenu(item.to)} />
          <Typography sx={{ color: 'red', fontWeight: 'Bold' }}>!</Typography>
        </ListItem>
      );
    } else {
      return (
        <ListItem button>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={getTitleByNganhHang(item)} onClick={() => handleClickMenu(item.to)} />
        </ListItem>
      );
    }
  };

  const MultiLevel = ({ item }) => {
    const { items: children } = item;
    const [open, setOpen] = useState(false);

    const user = item.isAuth?.user;
    var listMenuValid = [];

    if (!user) {
      listMenuValid = children;
    } else {
      if (user.isAdministrator === "1") {
        if (user.role_Code === 1) {
          listMenuValid = children;
        } else {
          listMenuValid = children.filter(x => ROLE_CODE.indexOf(x.no) < 0);
        }
      } else {
        const listPermission = user?.listPermission ? user?.listPermission : [];
        listMenuValid = children.filter(x => listPermission.indexOf(x.no) > -1);
      }
    }


    const handleClick = () => {
      setOpen((prev) => !prev);
    };

    return (
      <>
        {listMenuValid && listMenuValid.length > 0 && <List
          sx={{
            width: "100%", maxWidth: 360,
            bgcolor: "background.paper"
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClick}>
            <ListItemIcon sx={{ minWidth: "40px !important" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={getTitleByNganhHang(item)} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {listMenuValid.map((child, key) => (
                <MenuItem key={key} item={child} />
              ))}
            </List>
          </Collapse>
        </List>
        }
      </>
    );
  };

  return menu.map((item, key) => <MenuItem key={key} item={item} data={"test"} />);
}

function mapStateToProps(state) {
  const { message } = state.appReducers;
  const { user } = state.appReducers.auth;
  return {
    message,
    userInfo: user
  };
}

export default connect(mapStateToProps)(NavMenu);
