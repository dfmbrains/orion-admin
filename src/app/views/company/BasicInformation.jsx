import {Box, Card, Divider, Grid, styled, TextField} from "@mui/material";
import {FlexBetween, FlexBox} from "app/components/FlexBox";
import MapMarkerIcon from "app/components/icons/MapMarkerIcon";
import {H4, H5, Small} from "app/components/Typography";
import {useFormik} from "formik";
import React, {Fragment, useState} from "react";
import * as Yup from "yup";
import TrainIcon from "../../components/icons/Bratislava";
import {updateCollectionDocumentById} from "../../firebase/firestoreFirebase";
import {companyFirebasePath} from "../../utils/constant";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import LogoImg from '../../assets/logo.png';
import TeamImg from '../../assets/team.png';
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {useSelector} from "react-redux";

// styled components
const ContentWrapper = styled(Box)(({theme}) => ({
   zIndex: 1,
   marginTop: 55,
   position: "relative",
   [theme.breakpoints.down("sm")]: {paddingLeft: 20, paddingRight: 20},
}));

const CoverPicWrapper = styled(Box)(() => ({
   top: 0,
   left: 0,
   height: 125,
   width: "100%",
   overflow: "hidden",
   position: "absolute",
   backgroundColor: "#C6D3ED",
}));

const ImageWrapper = styled(Box)(({theme}) => ({
   width: 100,
   height: 100,
   margin: "auto",
   overflow: "hidden",
   borderRadius: "50%",
   border: "2px solid",
   borderColor: "white",
   backgroundColor: theme.palette.primary[200],

   "& img": {
      width: "100%",
      height: "100%"
   }
}));

const BasicInformation = ({companyData, setCompanyData}) => {
   const {constants} = useSelector((state) => state.constants);

   const {name, email, phoneNumber, address} = companyData.about
   const initialValues = {name, email, phoneNumber, address};

   const validationSchema = Yup.object({
      name: Yup.string()
          .required("Обязательно введите название"),
      email: Yup.string()
          .email("Invalid email address")
          .required("Обязательно введите email"),
      phoneNumber: Yup.string()
          .min(9)
          .required("Обязательно введите номер телефона"),
      address: Yup.string()
          .required("Обязательно введите адрес"),
   });

   const {enqueueSnackbar} = useSnackbar();
   const [loading, setLoading] = useState(false)
   const [confirmationDialog, setConfirmationDialog] = useState(false)

   const {values, errors, handleSubmit, handleChange, handleBlur, touched} = useFormik({
      initialValues,
      validationSchema,
      onSubmit: () => setConfirmationDialog(true)
   });

   const handleUpdate = async () => {
      setConfirmationDialog(false)
      setLoading(true)

      const createdData = {...companyData, about: values}

      try {
         await updateCollectionDocumentById(companyFirebasePath, createdData, companyData.id)

         enqueueSnackbar("Успешно отредактировано", {variant: "success"})
         setCompanyData(createdData)
      } catch (e) {
         enqueueSnackbar("Произошла ошибка", {variant: "error"})
      }
      setLoading(false)
   }

   return (
       <Fragment>
          <Card sx={{padding: 3, position: "relative"}}>
             <CoverPicWrapper>
                <img
                    width="100%"
                    height="100%"
                    alt="team"
                    src={TeamImg}
                    style={{objectFit: "cover"}}/>
             </CoverPicWrapper>

             <ContentWrapper>
                <FlexBox justifyContent="center">
                   <ImageWrapper>
                      <img src={LogoImg} alt={name} sizes="large"/>
                   </ImageWrapper>
                </FlexBox>

                <Box mt={2}>
                   <H4 fontWeight={600} textAlign="center">
                      {name}
                   </H4>

                   <FlexBetween maxWidth={400} flexWrap="wrap" margin="auto" mt={1}>
                      <FlexBox alignItems="center" gap={1}>
                         <TrainIcon sx={{color: "text.disabled"}}/>
                         <Small fontWeight={600} color="text.disabled">
                            Перевозки
                         </Small>
                      </FlexBox>

                      <FlexBox alignItems="center" gap={1}>
                         <MapMarkerIcon sx={{color: "text.disabled"}}/>
                         <Small fontWeight={600} color="text.disabled">
                            Бишкек
                         </Small>
                      </FlexBox>
                   </FlexBetween>
                </Box>
             </ContentWrapper>
          </Card>

          <Card sx={{mt: 3}}>
             <H5 padding={3}>Основная информация</H5>
             <Divider/>

             <form onSubmit={handleSubmit}>
                <Box margin={3}>
                   <Grid container spacing={3}>
                      <Grid item sm={6} xs={12}>
                         <TextField
                             fullWidth
                             name="name"
                             label="Название"
                             variant="outlined"
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.name}
                             helperText={touched.name && errors.name}
                             error={Boolean(touched.name && errors.name)}
                         />
                      </Grid>

                      <Grid item sm={6} xs={12}>
                         <TextField
                             fullWidth
                             name="email"
                             label="Admin Email"
                             variant="outlined"
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.email}
                             helperText={touched.email && errors.email}
                             error={Boolean(touched.email && errors.email)}
                         />
                      </Grid>

                      <Grid item sm={6} xs={12}>
                         <TextField
                             fullWidth
                             name="phoneNumber"
                             label="Номер телефона"
                             variant="outlined"
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.phoneNumber}
                             helperText={touched.phoneNumber && errors.phoneNumber}
                             error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                         />
                      </Grid>

                      <Grid item sm={6} xs={12}>
                         <TextField
                             fullWidth
                             name="address"
                             label="Адрес"
                             variant="outlined"
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.address}
                             helperText={touched.address && errors.address}
                             error={Boolean(touched.address && errors.address)}
                         />
                      </Grid>

                      <Grid item xs={12}>
                         <LoadingButton onClick={() => setConfirmationDialog(true)} loading={loading} type="button"
                                        variant="contained">
                            Сохранить
                         </LoadingButton>
                      </Grid>
                   </Grid>
                </Box>

                {confirmationDialog && (
                    <ConfirmationDialog
                        password={constants?.passwordForEdit || ''}
                        text="Введите пароль для редактирования"
                        open={confirmationDialog}
                        onConfirmDialogClose={() => setConfirmationDialog(false)}
                        onYesClick={handleUpdate}
                    />
                )}
             </form>
          </Card>
       </Fragment>
   );
};

export default BasicInformation;
