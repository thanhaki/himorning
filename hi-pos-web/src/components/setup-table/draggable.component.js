import React, { useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import { showLoading, hideLoading, reFetchData, updateTableList, setMessage, removeTable } from "../../actions/index";
import { Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateDialog from './config-table.component';
import AlertDialogMessage from '../common/dialog-confirm.component';
import TableService from '../../services/table.service';
import IconButton from '@mui/material/IconButton';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
function DraggableItem(props) {
    const dispatch = useDispatch();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [table, setTable] = useState({});
    const [isActive, setIsActive] = useState(0);

    const onStart = (e) => {
        let hover = isActive + 1;
        setIsActive(hover);
        if (hover === 1) {
            e.target.classList.add('hovered');
        }
    };

    const onStop = (e, draggableData, tbl) => {

        let hover = isActive - 1;
        setIsActive(hover);
        e.target.classList.remove('hovered');

        if (tbl) {
            const x = draggableData.x;
            const y = draggableData.y;
            const itemUpdate = {
                id: tbl.isAddNew ? 0 : tbl.id,
                idTemp: tbl.idTemp,
                x: x,
                y: y,
            };
            dispatch(updateTableList(itemUpdate));
        }
    };
    const handleSetting = (tbl) => {
        setTable(tbl);
        setOpen(true);
    }

    const handleDelete = (tbl) => {
        setTable(tbl);
        setIsDelete(true);
        dispatch(setMessage(`Bạn có muốn xóa Vị trí này không?`));
    }

    const confirmDeleteOk = () => {
        const data = {
            id: table.id,
            maOutlet: parseInt(params.id),
            donVi: props.userInfo?.user?.donVi
        }
        const tbl = props.tableList.find(t => t.id === table.id && table.isAddNew);
        if (tbl) {
            dispatch(removeTable(table));
            handleClose();
        }
        else {
            dispatch(showLoading(true));
            TableService.deleteTable(data).then(() => {
                handleClose();
                dispatch(hideLoading());
                dispatch(reFetchData(true));
                showMessageByType(null, "Xóa Vị trí thành công", TYPE_ERROR.success)

            }).catch((error) => {
                dispatch(hideLoading());
                showMessageByType(error, "Xóa Vị trí không thành công", TYPE_ERROR.error)
            });
        }
    }

    const handleClose = () => {
        setOpen(false);
        setIsDelete(false);
    }

    const handleUpdateTbl = (tbl) => {
        const data = {
            maOutlet: parseInt(params.id),
            donVi: props.userInfo?.user?.donVi,
            table: tbl
        }
        dispatch(showLoading(true));
        TableService.updateTable(data).then(() => {
            handleClose();
            dispatch(hideLoading());
            showMessageByType(null, "Cập nhật thông tin thành công", TYPE_ERROR.success)
            dispatch(reFetchData(true));
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "Cập nhật thông tin không thành công", TYPE_ERROR.error)
        });
    }

    const dragHandlers = { onStart: onStart };
    const renderTable = () => {
        return props.tableList.map((table, i) => {
            return <Draggable
                handle="strong"
                {...dragHandlers}
                position={{x: table.x, y: table.y}    }
                onStop={(event, draggableData) => onStop(event, draggableData, table)}
                key={table.id + '-' + table.idTemp}
                bounds="parent"
            >
                <div className="box no-cursor">
                    <strong className="cursor"><div>Vị trí: {table.tenBan}</div></strong>
                    <Typography variant="body2">
                            {table.mieuTaBan}
                        </Typography>
                        <div className="group-btn">
                        <IconButton
                            aria-label="Xóa"
                            color="error"
                            onClick={() => handleDelete(table)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton
                            aria-label="Cập nhật"
                            onClick={() => handleSetting(table)}
                            color="primary">
                            <SettingsIcon />
                        </IconButton>
                    </div>
                </div>
            </Draggable>
        })
    }
    return (
        <div className="box" style={{width: '100%', position: 'relative', overflow: 'auto', padding: '0' }}>
            <div style={{ height: '100%', width: '100%', borderRadius: '3px' }}>
                {renderTable()}
                <UpdateDialog
                    open={open}
                    handleClose={handleClose}
                    callbackFunc={handleUpdateTbl}
                    table={table}
                />
                <AlertDialogMessage
                    open={isDelete}
                    handleClose={handleClose}
                    title="Xóa Vị trí"
                    callbackFunc={confirmDeleteOk}
                />
            </div>
        </div>
    );

}
function mapStateToProps(state) {
    const { tableList } = state.appReducers.setupTbl;
    const { message } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    return {
        tableList: tableList ? tableList : [],
        message,
        userInfo: user,
    };
}

export default connect(mapStateToProps)(DraggableItem);