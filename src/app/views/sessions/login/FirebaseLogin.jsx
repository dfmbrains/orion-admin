import {LoadingButton} from "@mui/lab";
import {Box, Card, Grid, styled, TextField, useTheme} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {MatxDivider, MatxLogo} from "app/components";
import {FlexAlignCenter, FlexBox} from "app/components/FlexBox";
import {Paragraph, Span} from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import {Formik} from "formik";
import {useSnackbar} from "notistack";
import React, {useState} from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {getAllConstants} from "../../../redux/actions/FirebaseContantsActions";
import {useDispatch} from "react-redux";

const Logo = styled(Box)(() => ({
   gap: 10,
   display: "flex",
   alignItems: "center",
   "& span": {fontSize: 26, lineHeight: 1.3, fontWeight: 800},
}));

const FirebaseRoot = styled(FlexAlignCenter)(({theme}) => ({
   background: "#1A2038",
   minHeight: "100vh !important",
   "& .card": {maxWidth: 800, margin: "1rem"},
   "& .cardLeft": {
      color: "#fff",
      height: "100%",
      display: "flex",
      padding: "32px 56px",
      flexDirection: "column",
      backgroundSize: "cover",
      background: "#161c37 url(/assets/images/bg-3.png) no-repeat",
      [theme.breakpoints.down("sm")]: {minWidth: 200},
      "& img": {width: 32, height: 32},
   },
   "& .authTitle": {marginTop: 16},
   "& .features": {
      "& .item": {
         position: "relative",
         marginBottom: 12,
         paddingLeft: 16,
         "&::after": {
            top: 8,
            left: 0,
            width: 4,
            height: 4,
            content: '""',
            borderRadius: 4,
            position: "absolute",
            backgroundColor: theme.palette.error.main,
         },
      },
   },
}));

// inital login credentials
const initialValues = {
   email: "max@gmail.com",
   password: "max12345",
   remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
   password: Yup.string()
       .min(6, "Password must be 6 character length")
       .required("Password is required!"),
   email: Yup.string().email("Invalid Email address").required("Email is required!"),
});

const FirebaseLogin = () => {
   const theme = useTheme();
   const navigate = useNavigate();
   const {state} = useLocation();
   const [loading, setLoading] = useState(false);
   const {enqueueSnackbar} = useSnackbar();
   const dispatch = useDispatch()

   const {signInWithEmail} = useAuth();

   const handleFormSubmit = async (values) => {
      setLoading(true);

      try {
         await signInWithEmail(values.email, values.password);
         dispatch(getAllConstants())
         navigate(state ? state.from : "/");
         enqueueSnackbar("Logged In Successfully", {variant: "success"});
      } catch (error) {
         enqueueSnackbar(error.message, {variant: "error"});
         setLoading(false);
      }
   };

   return (
       <FirebaseRoot>
          <Card className="card">
             <Grid container>
                <Grid item sm={6} xs={12}>
                   <div className="cardLeft">
                      <Logo>
                         <MatxLogo/> <span>Orion Trans</span>
                      </Logo>

                      <h1 className="authTitle">Admin Dashboard</h1>

                      <Span sx={{flexGrow: 1}}></Span>
                   </div>
                </Grid>

                <Grid item sm={6} xs={12}>
                   <Box px={4} mt={2}>
                      <h1 className="authTitle">Sign In</h1>
                   </Box>

                   <MatxDivider sx={{px: 1}}/>

                   <Box p={4}>
                      <Formik
                          onSubmit={handleFormSubmit}
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                      >
                         {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
                             <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="email"
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    value={values.email}
                                    onChange={handleChange}
                                    helperText={touched.email && errors.email}
                                    error={Boolean(errors.email && touched.email)}
                                    sx={{mb: 3}}
                                />

                                <TextField
                                    fullWidth
                                    size="small"
                                    name="password"
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    value={values.password}
                                    onChange={handleChange}
                                    helperText={touched.password && errors.password}
                                    error={Boolean(errors.password && touched.password)}
                                    sx={{mb: 1.5}}
                                />

                                <FlexBox justifyContent="space-between">
                                   <FlexBox alignItems="center" gap={1}>
                                      <Checkbox
                                          size="small"
                                          name="remember"
                                          onChange={handleChange}
                                          checked={values.remember}
                                          sx={{padding: 0}}
                                      />

                                      <Paragraph>Remember Me</Paragraph>
                                   </FlexBox>

                                   <NavLink
                                       to="/session/forgot-password"
                                       style={{color: theme.palette.primary.main}}
                                   >
                                      Forgot password?
                                   </NavLink>
                                </FlexBox>

                                <LoadingButton
                                    type="submit"
                                    color="primary"
                                    loading={loading}
                                    variant="contained"
                                    sx={{my: 2}}
                                >
                                   Login
                                </LoadingButton>

                                <Paragraph>
                                   Don't have an account?
                                   <NavLink
                                       to="/session/signup"
                                       style={{color: theme.palette.primary.main, marginLeft: 5}}
                                   >
                                      Register
                                   </NavLink>
                                </Paragraph>
                             </form>
                         )}
                      </Formik>
                   </Box>
                </Grid>
             </Grid>
          </Card>
       </FirebaseRoot>
   );
};

export default FirebaseLogin;
