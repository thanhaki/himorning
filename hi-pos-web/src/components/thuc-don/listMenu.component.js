
import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import { showLoading, hideLoading, setMessage, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import { connect } from "react-redux";
import EditMenuItem from './editMenuItem.component';
import AddMenu from './addMenu.component';
import menuService from '../../services/menu.service';
import AlertDialogMessage from '../common/dialog-confirm.component';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import MenuItem from './dropMenu.component';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ToFormData } from '../../helpers/utils';
const theme = createTheme();

  
function ListMenu(props) {

    const [listMenu, setListMenu] = useState([]);
    const [open, setOpen] = useState(false);
    const [isReload, setIsReload] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
	const [id_Del, setId_Del] = useState(null);
    const [nameRow, setNameRow] = useState({});

    const dispatch = useDispatch()

    useEffect(() => {
        search();
    }, [isReload, props.isReFetchData])

    const search = () => {
        let data = props.userInfo?.user?.donVi
        dispatch(showLoading(true));
        menuService.getAllThucDon(data).then((result) => {
            const modifiedData = result.data.map((item) => ({
                ...item,
                id: item.id.toString(), // Chuyển đổi id sang chuỗi
            }));
            setListMenu(modifiedData);
            setNameRow('');
            dispatch(reFetchData(false));
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return; // Không có vị trí mới
      
        const reorderedItems = [...listMenu];
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);
      
        setListMenu(reorderedItems); // Cập nhật danh sách sau khi sắp xếp
        var lst = reorderedItems.map((item,index) => ({
            id: item.id,
            ten_TD: item.ten_TD,
            hinhAnh_TD: item.hinhAnh_TD,
            sort: index + 1,
        }));
        const values = {}; // Khai báo biến values

        values.ids = reorderedItems.map(item => item.id);
        values.menuItems = lst;
        values.donVi = props.userInfo?.user?.donVi;
        const formData = new FormData();
		ToFormData({ data: values }, formData);

        menuService.updateSort(formData).then((res) => {
            search();
            dispatch(hideLoading());
            showMessageByType(null, "success", TYPE_ERROR.success)
        }).catch((error) => {
            showMessageByType(error, "error", TYPE_ERROR.error)
            dispatch(hideLoading());
        })

      };
    
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleCloseDel = () => {
        setOpenDelete(false);
    }


    const handleDeleteOk = () => {
        var data = { 
            ids: id_Del,
            donVi: props.userInfo?.user?.donVi
        }

        if (data.ids.length > 0) {
            dispatch(showLoading(true));
            menuService.deleteThucDon(data).then((res) => {
                dispatch(hideLoading());
                setOpenDelete(false);
                handleLoadPage();
                showMessageByType(null, "success", TYPE_ERROR.success)
            }).catch((error) => {
                showMessageByType(error, "error", TYPE_ERROR.error)

                dispatch(hideLoading());
            })
        }
    }
    const handleDelete = (event) => {
        if (event.length === 0) {
            showMessageByType(null, "Chọn thực đơn cần xóa!!", TYPE_ERROR.warning)
            return;
        }
        setId_Del(event);
        dispatch(setMessage("Bạn có muốn xóa các thực đơn <b>đã chọn</b> không?"))
        setOpenDelete(true);
    }
    const handleEditClose = () => {
        search();
        setOpenEdit(false)
    };
    const handleLoadPage = () => {
        setIsReload(!isReload);
    }

    const handleRowClick = (params) => {
        setNameRow(params);
        setOpenEdit(true)
    };
    const editCategory = React.useMemo(() => {
        return (<EditMenuItem open={openEdit} nameRow={nameRow} handleClose={handleEditClose} handleLoadPageParent={handleLoadPage}/>);
    }, [openEdit]); 

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="true">
                <CssBaseline />
                <Box sx={{ mt: 1 }}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="menu-list">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {listMenu.map((menu, index) => (
                                        <MenuItem key={menu.id} menu={menu} index={index} handleDelete={handleDelete} handleRowClick={handleRowClick}/>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Box sx={{ mt: 3, mb: 3 }}>
                    <Grid container justifyContent="flex-end">
                        <Button variant="outlined" startIcon={<SendIcon />} onClick={handleOpen}>Thêm mới</Button>
                    </Grid>
                </Box>
                </Box>
            </Container>
            {open && <AddMenu open={open} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
            {editCategory}
            <AlertDialogMessage
                open={openDelete}
                handleClose={handleCloseDel}
                title="Xóa Thực Đơn"
                callbackFunc={handleDeleteOk}
            />
        </ThemeProvider >
    );
}

function mapStateToProps(state) {
    const { message, isShow, title} = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { isReFetchData } = state.appReducers.message;
    return {
        message,
        userInfo: user,
        isReFetchData,
        title
    };
}

export default connect(mapStateToProps)(ListMenu);