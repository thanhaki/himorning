import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://himon.vn/">
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'} Toàn bộ bản quyền thuộc www.himon.vn
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      maxWidth="xxl"
      component="footer"
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        py: [3, 6],
      }}
      style={{backgroundColor:"#f4f5f6", padding:3, marginTop:10}}
    >
      <Grid container justifyContent="space-evenly">
        <Grid item xs={12} sm={6} md={3} style={{padding:10}}>
            <Typography variant="h6" style={{fontSize:13, borderBottom: "1px solid rgb(212, 212, 212)"}} color="text.primary" gutterBottom>
            GIẢI PHÁP HỖ TRỢ
            </Typography>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  1. Phần mềm nhà thuốc
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  2. Phần mềm siêu thị
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  3. Phần mềm cửa hàng quần áo thời trang
                  </Link>
                </li>   
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  4. Phần mềm cửa hàng tạp hóa
                  </Link>
                </li>   
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  5. Phần mềm cửa hàng mẹ và bé
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  6. Phần mềm cửa hàng mỹ phẩm
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  7. Phần mềm cửa hàng văn phòng phẩm
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  8. Phần mềm cửa hàng đồ chơi
                  </Link>
                </li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={3} style={{padding:10}}>
            <Typography variant="h6" style={{fontSize:13, borderBottom: "1px solid rgb(212, 212, 212)"}} color="text.primary" gutterBottom>
            GIẢI PHÁP HỖ TRỢ
            </Typography>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  9. Phần mềm cửa hàng điện máy
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  10. Phần mềm cửa hàng vật tư nông nghiệp
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  11. Phần mềm cửa hàng thuốc bảo về thực vật
                  </Link>
                </li>   
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  12. Phần mềm cửa hàng thú cưng
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  13. Phần mềm quán ăn, quán cafe
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  14. Phần mềm club billard
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13, fontWeight:800}} color="text.secondary" underline="none">
                  15. Phần mềm nhà hàng
                  </Link>
                </li>
            </ul>
          </Grid>

      <Grid item xs={12} sm={6} md={3} style={{padding:10}}>
            <Typography variant="h6" style={{fontSize:13, borderBottom: "1px solid rgb(212, 212, 212)"}} color="text.primary" gutterBottom>
            THÔNG TIN HỖ TRỢ
            </Typography>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  - Hỗ trợ khách hàng: <Link style={{fontWeight: 800, textDecorationLine: 'none'}} href={`tel:${+84867991579}`}>086 799 1579 (zalo)</Link>
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  - Phòng kinh doanh: <Link style={{fontWeight: 800, textDecorationLine: 'none'}} href={`tel:${+84367201108}`}>036 720 1108 (zalo)</Link>
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  - Hotline: <Link style={{fontWeight: 800, textDecorationLine: 'none'}} href={`tel:${+84918252214}`}>0918 252 214 (zalo)</Link>
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  - Email: <lab style={{fontWeight: 800}}>info.himorning@gmail.com</lab>
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  - Thời gian: <lab style={{fontWeight: 800}}>7h00 – 21h00 các ngày trong tuần</lab>
                  </Link>
                </li>
            </ul>
          </Grid>
        <Grid item xs={12} sm={6} md={3} style={{padding:10}}>
            <Typography variant="h6" style={{fontSize:13, borderBottom: "1px solid rgb(212, 212, 212)"}} color="text.primary" gutterBottom>
            LIÊN HỆ
            </Typography>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:12, fontWeight: 800}} color="text.secondary" underline="none">
                  CÔNG TY TNHH TƯ VẤN PHÁT TRIỂN CÔNG NGHỆ BÌNH MINH
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  MST: 5801510058
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  Email: info.himorning@gmail.com
                  </Link>
                </li>
                <li>
                  <Link href="#" variant="subtitle1" style={{fontSize:13}} color="text.secondary" underline="none">
                  Đ/c: Tân Tiến, Tân Văn, Huyện Lâm Hà, Tỉnh Lâm Đồng
                  </Link>
                </li>
                
            </ul>
          </Grid>
      </Grid>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}