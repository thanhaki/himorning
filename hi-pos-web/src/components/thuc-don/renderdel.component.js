

import React from 'react';
import { connect, useDispatch } from "react-redux";
import thucDonMatHangService from '../../services/thucDonMatHang.service';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import DeleteIcon from '@mui/icons-material/Delete';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';

const RenderDeleteCell = (props) => {
    const dispatch = useDispatch();
    const handleDelete = () => {
        var data = {
            id_MH: props.props.id,
            id_TD: props.thucdon.id,
            donVi: props.userInfo?.user?.donVi,
        };
        dispatch(showLoading(true));
        thucDonMatHangService.deleteThucDonMatHang(data).then(() => {
            dispatch(hideLoading());
            dispatch(reFetchData(true));
            showMessageByType(null, "success", TYPE_ERROR.success)
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error)
        });
    }
    return (
        <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <DeleteIcon fontSize="small" onClick={handleDelete} />
        </div>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { thucdon } = state.appReducers.thucdon;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    return {
        isLoggedIn,
        isReFetchData,
        thucdon,
        userInfo: user
    };
}

export default connect(mapStateToProps)(RenderDeleteCell);