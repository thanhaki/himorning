import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import StepButton from '@mui/material/StepButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CssBaseline from '@mui/material/CssBaseline';
import LinearProgress from '@mui/material/LinearProgress';
import RedoIcon from '@mui/icons-material/Redo';
import CheckCircleIcons from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import Tooltip from '@mui/material/Tooltip';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import { useDispatch, connect } from 'react-redux';
import TableService from '../../services/table.service';
import StepLabel from '@mui/material/StepLabel';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { showMessageByType } from '../../helpers/handle-errors';
import donviService from '../../services/donvi.service';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import Grid from '@mui/material/Grid';
import CircularProgress, {
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import { useTheme } from '@mui/material/styles';
import { showLoading, hideLoading, setMessage } from "../../actions/index";

const theme2 = createTheme({ typography: { fontSize: 20 } });

const theme = createTheme();

function CircularProgressWithLabel({ value, ...props }) {
    const circleSize = 100;
    // begin : tùy chỉnh màu viền tiền trình
    const getBorderColor = () => {
        if (value >= 100) {
            return 'text.primary'; // Màu viền khi đạt 100% hoặc cao hơn
        }
        return 'text.disabled'; // Màu viền khi chưa đạt 100%
    };
    // end : tùy chỉnh màu viền tiền trình
    // begin : tùy chỉnh màu số phần trăm tiến trình
    const getColor = (value) => {
        if (value === 100) {
            return "text.primary";
        } else if (value >= 70) {
            return "success.main";
        } else if (value >= 30) {
            return "warning.main";
        } else {
            return "text.disabled";
        }
    };
    const color = getColor(value);
    return (
        <Box sx={{ position: "absolute", display: "inline-flex", alignItems: "center", justifyContent: "center", }}>
            <CircularProgress
                variant="determinate"
                size={60}
                value={value}
                thickness={2}
                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    color: getBorderColor(),
                    justifyContent: "center",
                }}
            >

                <Typography
                    variant="caption"
                    component="div"
                    color={color}
                    sx={{ fontSize: '15px' }}
                >
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}
// end : tùy chỉnh màu số phần trăm tiến trình
// begin : xử lý mũi tên màu xanh
const ArrowIcon = () => {
    return (
        <StepLabel
            sx={{
                // mt: 0.5,
                ml: 0.5,
                color: "#f44336", //gray when disabled/inactive
                "& .MuiStepLabel-label.Mui-active": {
                    color: "green", // color icon blue (when active)
                }
            }}
            icon={<span />}>
            <ArrowForwardIcon />
        </StepLabel>

    );
}
// note: ArrowIcon component đc sử dụng bên dưới trong phần hiển thị step redirect
// end : xử lý mũi tên màu xanh 


// ----------------------------------------------

function IntroductionHRAM(props) {
    //
    const [progressAA, setProgressAA] = React.useState(0);
    const [totalStepsCompleted, setTotalStepsCompleted] = React.useState(0);
    // const [progressAA, setProgressAA] = useState(() => {

    //   const valueStep = localStorage.getItem('activeStep');

    //   return valueStep ? parseInt(valueStep * 10) : 0;
    // });
    const [buffers, setBuffers] = React.useState(10);

    const progressRef = React.useRef(() => { });
    React.useEffect(() => {
        progressRef.current = () => {
            if (progressAA > 100) {
                // setProgressAA(0);
                // setBuffers(10);
            } else {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                // setProgressAA(progressAA + diff);
                // setBuffers(progressAA + diff + diff2);
            }
        };
    });

    React.useEffect(() => {
        const timer = setInterval(() => {
            progressRef.current();
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);
    // khởi tạo mảng object introductionSteps
    const [introductionSteps, setIntroductionSteps] = useState([
        {
            idC: 1,
            label: 'Tạo mới ca làm việc của nhân viên tại cửa hàng',
            description: `Ví dụ :`,
            examples: ['Mã: MO - Ca sáng làm từ 6:00 - 14:00', 'Mã: AT - Ca chiều làm từ 13:00 - 21:00'],
            steps: [{
                ids: 'a',
                label: 'Menu',
                itemNo: 0
            }, {
                ids: 'b',
                label: 'Nhân sự',
                itemNo: 1151
            }, {
                ids: 'c',
                label: 'Định nghĩa ca làm việc',
                itemNo: 1156
            }],
            route: '/ca-lam-viec',
        },
        {
            idC: 2,
            label: 'Tạo mới hồ sơ nhân viên',
            description:
                'Ví dụ :',
            examples: ['Tạo thông tin nhân viên: họ tên, điện thoại, địa chỉ, số điện thoại, … '],
            steps: [{
                ids: 'a',
                label: 'Menu',
                itemNo: 0
            }, {
                ids: 'b',
                label: 'Nhân sự',
                itemNo: 1151
            }, {
                ids: 'c',
                label: 'Tạo mới hồ sơ nhân viên',
                itemNo: 1152
            }],
            route: '/hoso-nhanvien',
        },
        {
            idC: 3,
            label: 'Tạo mới hệ số nhân viên',
            description: `Ví dụ:`,
            examples: ['Tổng công/ tháng: 26 ngày (1 tuần 1 ngày nghỉ)', 'Lương cơ bản/ ngày: 185,000', 'Hệ số lương theo cấp bậc: Đại học - 1.4; Cao  đẳng - 1.0', 'Hệ số lương theo thâm niên/ năm: Thâm niên công tác 1-2 năm -> 0.1; Thâm niên công tác từ 2-3 năm -> 0.2', 'Mức phụ cấp/ tháng: 1,000,000', 'Đơn giá tăng ca/ giờ: 35,000', 'Số tiền nhân viên đóng BHXH/ tháng: 578,378'],
            steps: [{
                ids: 'a',
                label: 'Menu',
                itemNo: 0
            }, {
                ids: 'b',
                label: 'Nhân sự',
                itemNo: 1151
            }, {
                ids: 'c',
                label: 'Hệ số nhân viên',
                itemNo: 1155
            }],
            route: '/heso-nhanvien',
        },
        {
            idC: 4,
            label: 'Lên lịch đi làm dự kiến cho nhân viên',
            description: `Ví dụ :`,
            examples: ['Nguyên Văn A: Ngày 2/6 làm ca sáng (MO) => Làm từ: 6:00 - 14:00', 'Nguyên Văn B: Ngày 2/6 làm ca chiều (AE) => Làm từ: 13:00 - 21:00'],
            steps: [{
                ids: 'a',
                label: 'Menu',
                itemNo: 0
            }, {
                ids: 'b',
                label: 'Nhân sự',
                itemNo: 1151
            }, {
                ids: 'c',
                label: 'Lịch làm việc',
                itemNo: 1153
            }],
            route: '/lich-lam-viec',
        },
        {
            idC: 5,
            label: 'Tính lương nhân viên',
            description: `Ví dụ :`,
            examples: ['Chọn năm, chọn tháng rồi bấm tính lương.', 'Click vào tên nhân viên để in bảng lương cá nhân.', 'Click vào nút "In Bảng Lương" để in bảng lương tổng hợp.'],
            steps: [{
                ids: 'a',
                label: 'Menu',
                itemNo: 0
            }, {
                ids: 'b',
                label: 'Nhân sự',
                itemNo: 1151
            }, {
                ids: 'c',
                label: 'Tính lương nhân viên',
                itemNo: 1154
            }],
            route: '/luong-nhanvien',
        }
    ]);

    const [apiResult, setApiResult] = useState([]);
    const dispatch = useDispatch()
    const [isReload, setIsReload] = useState(false);
    // const [listLanguage, setListLanguage] = useState([]);
    /// load data ban đầu

    const getDataNNTheoNganhHang = () => {
        var user = props.userInfo?.user;
        dispatch(showLoading(true));
        donviService.getDataNgonNguTheoNganhHang(user.nganhHang)
            .then(res => {
                // setListLanguage(res.data);
                const updateSteps = introductionSteps.map((step) => {
                    const updateStepsChild = step.steps.map((stepChild) => {
                        const itemNo = stepChild.itemNo;
                        const labelSteps = stepChild.label;
                        const resultLanuage = res.data.find(result => result.maChucNang === itemNo);
                        const rs = resultLanuage && resultLanuage.vietNamese ? resultLanuage.vietNamese : labelSteps;
                        return { ...stepChild, label: rs };
                    });
                    return { ...step, steps: updateStepsChild };
                });
                setIntroductionSteps(updateSteps);
                dispatch(hideLoading());
            })
            .catch(error => {
                dispatch(hideLoading());
            });
    };

    useEffect(() => {
        getDataNNTheoNganhHang();
    }, []);

    const handleLoadPage = () => {
        setIsReload(!isReload);
    }

    const [strRoute, setStrRoute] = React.useState('');

    // begin redirect
    // khởi tạo biến pageRedirect int để lấy giá trị khi click vào step label
    // const [pageRedirect, setPageRedirect] = React.useState(0);
    const [pageRedirect, setPageRedirect] = useState(() => {
        const storedStep = localStorage.getItem('activeStep');
        return storedStep ? parseInt(storedStep) : 0;
    });

    const navigate = useNavigate();
    const redirectAction = () => {
        console.log(pageRedirect);
        {
            switch (pageRedirect) {
                case 0:
                    navigate("/ca-lam-viec");
                    break;
                case 1:
                    navigate("/hoso-nhanvien");
                    break;
                case 2:
                    navigate("/heso-nhanvien");
                    break;
                case 3:
                    navigate("/lich-lam-viec");
                    break;
                default:
                    navigate("/luong-nhanvien");
                    break;
            }
        }
    }
    // Progress Bar -----------------

    const [completed, setCompleted] = React.useState({});
    const [tienTrinh, setTienTrinh] = useState(0);
    const [progressBar, setProgressBar] = useState(0);

    // khởi tạo biến activeStep để kiểm tra bước đang vừa bấm
    //const [activeStep, setActiveStep] = React.useState(0);
    const [activeStep, setActiveStep] = useState(() => {
        // sau khi lưu vào localStorage thì lấy ra để có thể biết đc đang ở bước thứ mấy
        const storedStep = localStorage.getItem('activeStep');
        // nếu ko tồn tại thì sẽ là bước số 1
        return storedStep ? parseInt(storedStep) : 0;
    });

    // khởi tạo đăng ký sự kiện: nếu biến activeStep có thay đổi thì nó tự động cập nhật lại localStorage
    useEffect(() => {
        localStorage.setItem('activeStep', activeStep.toString());
    }, [activeStep]);

    // tổng số bước
    const totalSteps = () => {
        return introductionSteps.length;
    };

    // các bước hoàn tất
    const completedSteps = () => {
        // trả ra tổng số bước từ completed array khai báo phía trên
        return Object.keys(completed).length;
    };

    // nếu bước vừa chọn == vs totalSteps - 1 thì đó là bước cuối cùng
    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    // so sánh để lấy ra số bước hoàn tất vs tổng số bước có bằng nhau ko
    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                introductionSteps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
        setPageRedirect(newActiveStep);
        let check = 0;
        for (let i = 0; i <= (newActiveStep); i++) {
            if (completed[i]) {
                check += 1;
            }
        }
        setProgressAA(check * 20);
    };

    // begin 3 functions : handleAlert, handleAlert, handleRedirect chỉ để test cho bước redirect
    const handleAlert = () => {
        alert(pageRedirect);
    };
    const handleClicks = (indexValue) => {
        handleRedirect(indexValue);
    };
    const handleRedirect = (ind) => {
        handleAlert();
    };
    // end 3 functions

    // khởi tạo style chứa cursor để css cho label điều hướng
    const cursorPointer = { cursor: 'pointer' };
    const handleBack = () => {
        const variableLocalStore = localStorage.getItem('activeStep') - 1;
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setPageRedirect(localStorage.getItem('activeStep') - 1);
        let check = 0;
        for (let i = 0; i <= (variableLocalStore); i++) {
            if (completed[i]) {
                check += 1;
            }
        }
        setProgressAA(check * 20);
    };

    // khi click vào step label thì nó thực thi 2 chức năng: 
    const handleStep = (step) => () => {
        // chức năng 1 là set active step vào localstore để lưu lại và load lại khi tải trang
        setActiveStep(step);
        if (completed[step]) {
            setProgressAA((step + 1) * 20);
        } else {
            setProgressAA((step) * 20);
        }
        // đồng thời chuyển hướng trang
        setPageRedirect(step);

        let check = 0;
        for (let i = 0; i <= step; i++) {
            if (completed[i]) {
                check += 1;
            }
        }
        setProgressAA(check * 20);

    };

    // dùng để click tay
    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        console.log(completed);
        handleNext();
    };

    // begin : xử lý phần hiển thị hoàn thành hay chưa
    // const [completed, setCompleted] = useState({});
    useEffect(() => {

        let data = props.userInfo?.user?.donVi
        dispatch(showLoading(data));
        TableService.getResultCheckTheHRAdministrativeManual(data).then((result) => {
            dispatch(hideLoading());
            setApiResult(result.data);
            const newCompleted = {};
            result.data.forEach((value, index) => {
                if (value > 0) {
                    newCompleted[index] = true;
                }
            });

            setCompleted(newCompleted);
            setTienTrinh(Object.keys(newCompleted).length * 20);
            setBuffers(Object.keys(newCompleted).length * 20);

            let check = 0;
            for (let i = 0; i <= activeStep; i++) {
                if (result.data[i]) {
                    check += 1;
                }
            }
            setProgressAA(check * 20);

            if (result.data[0] && result.data[1] && result.data[2] && result.data[3] && result.data[4] && result.data[5] && result.data[6] && result.data[7] && result.data[8] && result.data[9]) {
                showMessageByType(null, "Tất cả các bước đã hoàn thành - Bạn Đã Hoàn Tất", TYPE_ERROR.success);
            } else {
                showMessageByType(null, "Bạn đã hoàn tất " + Object.keys(newCompleted).length * 20 + "% Tiến Trình", TYPE_ERROR.success)
            }

        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, 'Lỗi lấy thông tin', TYPE_ERROR.error);
        })
    }, [isReload]);

    // end : xử lý phần hiển thị hoàn thành hay chưa

    // reset lại trang
    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
        handleLoadPage();
    };

    return (
        <Container component="main" maxWidth="true" >
            <CssBaseline />
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12}>
                        <Typography gutterBottom align="center" component="h1" variant="h4" sx={{ pt: 6, pb: 2 }}>
                            HƯỚNG DẪN THIẾT LẬP NHÂN SỰ
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2} sx={{ padding: '5%', paddingTop: 3 }}>
                <Grid item xs={12} sm={12} lg={12}>
                    <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                        {introductionSteps.map((step, index) => (
                            <Step key={step.label} completed={completed[index]}>
                                <StepButton sx={{ "& .MuiSvgIcon-root": { color: "warning.main", fontSize: "2.1rem" } }} color="inherit" onClick={handleStep(index)}
                                    optional={
                                        index === 9 ? (
                                            <Typography variant="caption">Bước cuối cùng</Typography>
                                        ) : null
                                    }
                                >
                                    <Typography sx={{ fontSize: 16.5 }}>{step.label}</Typography>
                                </StepButton>
                                <StepContent>
                                    <Typography sx={{ pl: 1, pb: 1, pt: 1 }}>{step.description}</Typography>
                                    {step.examples.map((example, indexExamples) => (
                                        <Typography sx={{ pl: 1, pb: 1 }}><FiberManualRecordIcon sx={{ paddingTop: 1 }} /> {example}</Typography>
                                    ))}
                                    <Box sx={{ width: '100%', mb: 1 }}>
                                        <Grid container spacing={1} sx={{ marginTop: 0 }}>
                                            {step.steps.map((stepChild, indexChild) => (
                                                <Grid item xs={12} md={6} lg={4} key={indexChild} sx={{ marginBottom: 2 }}>
                                                    <Stepper connector={<ArrowIcon />} activeStep={2} >
                                                        <Step key={stepChild.label}>
                                                            <Grid item xs={12} sm={12} md={12} lg={12} key={indexChild}>
                                                                {indexChild === 0 ? (
                                                                    <StepLabel StepIconComponent={MenuIcon}>
                                                                        <Typography sx={{ fontSize: 15, fontWeight: 'Bold' }}>
                                                                            Bước {indexChild + 1} : Chọn -{'>'} {stepChild.label}
                                                                        </Typography>
                                                                    </StepLabel>
                                                                ) : (
                                                                    (indexChild === 1) ? (
                                                                        <StepLabel sx={{ justifyContent: 'center' }} StepIconComponent={PrivacyTipOutlinedIcon}>
                                                                            <Typography sx={{ fontSize: 15, fontWeight: 'Bold' }}>
                                                                                Bước {indexChild + 1} : Chọn -{'>'} {stepChild.label}
                                                                            </Typography>
                                                                        </StepLabel>
                                                                    ) : (
                                                                        (index === 8) ? (
                                                                            (indexChild === 3) ? (
                                                                                <StepLabel style={cursorPointer} StepIconComponent={CheckCircleIcons} onClick={redirectAction}>
                                                                                    <Tooltip title="Click me to setup">
                                                                                        <Typography sx={{ fontSize: 15, fontWeight: 'Bold' }}>
                                                                                            Bước {indexChild + 1} : Chọn -{'>'} {stepChild.label}
                                                                                        </Typography>
                                                                                    </Tooltip>
                                                                                </StepLabel>
                                                                            ) : (
                                                                                <StepLabel StepIconComponent={NextPlanIcon}>
                                                                                    <Typography sx={{ fontSize: 15, fontWeight: 'Bold' }}>
                                                                                        Bước {indexChild + 1} : Chọn -{'>'} {stepChild.label}
                                                                                    </Typography>
                                                                                </StepLabel>
                                                                            )
                                                                        ) : (
                                                                            <StepLabel style={cursorPointer} StepIconComponent={CheckCircleIcons} onClick={redirectAction}>
                                                                                <Tooltip title="Click me to setup">
                                                                                    <Typography sx={{ fontSize: 15, fontWeight: 'Bold' }}>
                                                                                        Bước {indexChild + 1} : Chọn -{'>'} {stepChild.label}
                                                                                    </Typography>
                                                                                </Tooltip>
                                                                            </StepLabel>
                                                                        )
                                                                    )
                                                                )}
                                                            </Grid>
                                                        </Step>
                                                    </Stepper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                    <Box sx={{ mb: 0 }}>
                                        <div>
                                            <Button
                                                disabled={index === 0}
                                                onClick={handleBack}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Trở lại
                                            </Button>
                                            {!((completed[0] && completed[1] && completed[2] && completed[3] && completed[4])) ? (
                                                <Button
                                                    disabled={completed[activeStep + 1]}
                                                    variant="contained"
                                                    onClick={handleNext}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    {index === introductionSteps.length - 1 ? 'hoàn tất các bước còn lại' : completed[activeStep] ? 'Đã hoàn tất' : 'Tiếp tục'}
                                                </Button>
                                            ) : ((index + 1) === introductionSteps.length ? (
                                                <Button
                                                    disabled={completed[activeStep]}
                                                    variant="contained"
                                                    onClick={handleNext}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Đã hoàn tất
                                                </Button>
                                            ) : (
                                                <Button
                                                    disabled={completed[activeStep + 1]}
                                                    variant="contained"
                                                    onClick={handleNext}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Đã hoàn tất
                                                </Button>)
                                            )}
                                            <Box sx={{ width: '100%', mt: 2, mb: 2, ml: 1 }}>
                                                <LinearProgress variant="buffer" value={progressAA} valueBuffer={buffers} />
                                            </Box>
                                            {activeStep !== introductionSteps.length &&
                                                (completed[activeStep] ? (
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 2, ml: 1, fontSize: 15 }}>
                                                        Bước {activeStep + 1} đã hoàn thành
                                                    </Typography>
                                                ) : ''
                                                )}
                                        </div>

                                    </Box>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    <Paper square elevation={0} sx={{ pt: 2 }}>
                        <Typography sx={{ fontSize: 15, color: 'red', fontWeight: 'Bold', fontStyle: 'italic' }}>Chú ý : </Typography>
                        <Typography sx={{ fontSize: 15, ml: 1, fontStyle: 'italic' }}><ArrowRightIcon sx={{ paddingTop: 0.5 }} /> Bạn có thể bổ sung thêm thông tin nhân viên, và chuyển qua bước 5 để tính lại bảng lương.</Typography>
                        <Typography sx={{ fontSize: 15, ml: 1, fontStyle: 'italic' }}><ArrowRightIcon sx={{ paddingTop: 0.5 }} /> Tại bước 5 bạn có thể nhập: số tiền khen thưởng, số tiền kỷ luật hoặc nhập tổng số giờ tăng ca của nhân viên.</Typography>
                    </Paper>
                    {(completed[0] && completed[1] && completed[2] && completed[3] && completed[4]) && (
                        <Paper square elevation={0} sx={{ pt: 2 }}>
                            <Typography sx={{ fontSize: 17 }}>Tất cả các bước đã hoàn thành - Bạn Đã Hoàn Tất</Typography>
                        </Paper>
                    )}
                    <Box sx={{ pt: 1, pb: 2, mb: 5 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <React.Fragment>
                            <Button
                                align='left'
                                justifyContent='left'
                                display='inline-block'
                                variant="contained"
                                // onClick={handleBack}
                                sx={{ mr: 1, mt: 1.5, background: 'color.primary', fontSize: '1rem' }}
                            >
                                Tiến trình đạt được :
                            </Button>
                            <CircularProgressWithLabel sx={{ color: 'green' }} value={tienTrinh} />
                        </React.Fragment>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

function mapStateToProps(state) {
    const { user } = state.appReducers.auth;
    return {
        userInfo: user
    };
}

export default connect(mapStateToProps)(IntroductionHRAM);