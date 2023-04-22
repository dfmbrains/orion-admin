import {Button, Card, Divider, Grid, Icon, MenuItem, TextField} from "@mui/material";
import {Box, styled, useTheme} from "@mui/system";
import {Breadcrumb} from "app/components";
import {FlexAlignCenter, FlexBox} from "app/components/FlexBox";
import {H4} from "app/components/Typography";
import {convertHexToRGB} from "app/utils/utils";
import {Formik} from "formik";
import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import * as yup from "yup";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {ru} from "date-fns/esm/locale";
import {genders, teamFirebasePath} from "../../../utils/constant";
import {DatePicker, LoadingButton} from "@mui/lab";
import {v4 as uuidv4} from 'uuid';
import {
   createCollectionDocument,
   getCollectionDocumentById, updateCollectionDocumentById,
} from "../../../firebase/firestoreFirebase";
import {deleteFileFromFirebase, getFileFromFirebase, uploadFileToFirebase} from "../../../firebase/fileFirebase";
import {useNavigate, useParams} from "react-router-dom";

const Container = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},
   "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: {marginBottom: "16px"},
   },
}));

const Form = styled("form")(() => ({
   paddingLeft: "16px",
   paddingRight: "16px",
}));

const StyledTextField = styled(TextField)(() => ({
   marginBottom: "16px",
}));

const StyledTextArea = styled(StyledTextField)(() => ({
   marginTop: "16px"
}));

const DropZone = styled(FlexAlignCenter)(({isDragActive, theme}) => ({
   height: 160,
   width: "100%",
   cursor: "pointer",
   borderRadius: "4px",
   margin: "16px 0",
   transition: "all 350ms ease-in-out",
   border: `2px dashed rgba(${convertHexToRGB(theme.palette.text.primary)}, 0.3)`,
   "&:hover": {
      background: `rgb(${convertHexToRGB(theme.palette.text.primary)}, 0.2) !important`,
   },
   background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));

const TeamForm = () => {
   const {id: teamMemberId} = useParams()
   const navigate = useNavigate()

   const [loading, setLoading] = useState(false)
   const [isImgPrev, setIsImgPrev] = useState(false)
   const [prevImgName, setPrevImgName] = useState('')

   const [imageList, setImageList] = useState([]);
   const {getRootProps, getInputProps, acceptedFiles} = useDropzone({accept: "image/*"})

   const [birthDate, setBirthDate] = useState(null)
   const [fromDate, setFromDate] = useState(null)

   const [initialValues, setInitialValues] = useState({
      firstName: "",
      lastName: "",
      midName: "",
      about: "",
      address: '',
      email: '',
      phoneNumber: '',
      gender: '',
      position: '',
   })

   const handleSubmit = async (values) => {
      setLoading(true)

      try {
         const createdData = {
            ...values,
            contacts: {address: values.address, phoneNumber: values.phoneNumber, email: values.email},
            birthDate: new Date(birthDate),
            workPeriod: {from: new Date(fromDate), to: null},
            status: true,
         }

         if (teamMemberId) {
            createdData.id = teamMemberId

            if (!isImgPrev) {
               deleteFileFromFirebase(`${teamFirebasePath}/${teamMemberId}/${prevImgName}`)
               await uploadFileToFirebase(imageList[0], `${teamFirebasePath}/${teamMemberId}/${uuidv4()}`)
            }
            await updateCollectionDocumentById(teamFirebasePath, createdData, teamMemberId)
         } else {
            createdData.id = uuidv4()

            await uploadFileToFirebase(imageList[0], `${teamFirebasePath}/${createdData.id}/${uuidv4()}`)
            await createCollectionDocument(teamFirebasePath, createdData)
         }
         navigate('/team')
      } catch (error) {
         console.log(error)
         setLoading(false)
      }
   };

   useEffect(() => {
      if (acceptedFiles.length > 0) {
         setIsImgPrev(false)
      }
      setImageList(acceptedFiles);
   }, [acceptedFiles]);
   useEffect(() => {
      if (teamMemberId) {
         setLoading(true)
         getFileFromFirebase(`${teamFirebasePath}/${teamMemberId}`)
             .then(fileResponse => {
                setImageList(fileResponse)
                setIsImgPrev(true)
                setLoading(false)
                setPrevImgName(fileResponse[0].name)
             })
         getCollectionDocumentById(teamFirebasePath, teamMemberId)
             .then(data => {
                setInitialValues({
                   firstName: data.firstName,
                   lastName: data.lastName,
                   midName: data.midName,
                   about: data.about,
                   address: data.contacts.address,
                   email: data.contacts.email,
                   phoneNumber: data.contacts.phoneNumber,
                   gender: data.gender,
                   position: data.position,
                })
                setBirthDate(data.birthDate.toDate())
                setFromDate(data.workPeriod.from.toDate())
             })
      }
   }, [teamMemberId])

   const {palette} = useTheme();
   const textMuted = palette.text.secondary;

   return (
       <Container>
          <div className="breadcrumb">
             <Breadcrumb routeSegments={[{
                name: "Список сотрудников",
                path: "/team"
             }, {name: teamMemberId ? "Редактирование" : "Создание"}]}/>
          </div>

          <Card elevation={3}>
             <Box p={2} display="flex">
                <H4>{teamMemberId ? 'Редактировать' : 'Создать'} сотрудника</H4>
             </Box>
             <Divider sx={{mb: 3}}/>

             <Formik
                 onSubmit={handleSubmit}
                 enableReinitialize={true}
                 initialValues={initialValues}
                 validationSchema={productSchema}
             >
                {({
                     values,
                     errors,
                     touched,
                     handleChange,
                     handleBlur,
                     handleSubmit
                  }) => (
                    <Form onSubmit={handleSubmit}>
                       <Grid container spacing={3}>
                          <Grid item sm={6} xs={12}>
                             <StyledTextField
                                 fullWidth
                                 name="firstName"
                                 label="Имя"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.firstName || ""}
                                 error={Boolean(touched.firstName && errors.firstName)}
                                 helperText={touched.firstName && errors.firstName}
                             />
                             <StyledTextField
                                 fullWidth
                                 name="lastName"
                                 label="Фамилия"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.lastName || ""}
                                 error={Boolean(touched.lastName && errors.lastName)}
                                 helperText={touched.lastName && errors.lastName}
                             />
                             <StyledTextField
                                 fullWidth
                                 name="midName"
                                 label="Отчество"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.midName || ""}
                                 error={Boolean(touched.midName && errors.midName)}
                                 helperText={touched.midName && errors.midName}
                             />

                             <StyledTextField
                                 select
                                 fullWidth
                                 size="small"
                                 name="gender"
                                 label="Пол"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.gender || ""}
                                 error={Boolean(touched.gender && errors.gender)}
                                 helperText={touched.gender && errors.gender}
                             >
                                {genders.sort().map((g, ind) => <MenuItem value={g} key={ind}>{g}</MenuItem>)}
                             </StyledTextField>

                             <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                                <DatePicker
                                    size={"small"}
                                    inputFormat="dd/MM/yyyy"
                                    value={birthDate}
                                    onChange={(value) => setBirthDate(value)}
                                    renderInput={(props) => (
                                        <TextField
                                            required
                                            size={"small"}
                                            {...props}
                                            label="Дата рождения"
                                            fullWidth
                                            onBlur={handleBlur}
                                            error={!birthDate}
                                            helperText={!birthDate && 'Обязательно напишите дату рождения'}
                                        />
                                    )}
                                />
                             </LocalizationProvider>

                             <DropZone multiple={false} {...getRootProps()}>
                                <input multiple={false} {...getInputProps()} />
                                <FlexBox alignItems="center" flexDirection="column">
                                   <Icon sx={{color: textMuted, fontSize: "48px"}}>publish</Icon>
                                   {imageList.length ? (
                                       <span>{imageList.length} фотографий выбрано</span>
                                   ) : (
                                       <span>Нажмите, чтобы загрузить</span>
                                   )}
                                </FlexBox>
                             </DropZone>
                          </Grid>

                          <Grid item sm={6} xs={12}>
                             <StyledTextField
                                 fullWidth
                                 name="position"
                                 label="Должность"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.position || ""}
                                 error={Boolean(touched.position && errors.position)}
                                 helperText={touched.position && errors.position}
                             />
                             <StyledTextField
                                 fullWidth
                                 name="address"
                                 label="Адрес проживания"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.address || ""}
                                 error={Boolean(touched.address && errors.address)}
                                 helperText={touched.address && errors.address}
                             />
                             <StyledTextField
                                 fullWidth
                                 name="phoneNumber"
                                 label="Номер телефона"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.phoneNumber || ""}
                                 error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                 helperText={touched.phoneNumber && errors.phoneNumber}
                             />
                             <StyledTextField
                                 fullWidth
                                 type={"email"}
                                 name="email"
                                 label="Электронная почта"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.email || ""}
                                 error={Boolean(touched.email && errors.email)}
                                 helperText={touched.email && errors.email}
                             />

                             <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                                <DatePicker
                                    size={"small"}
                                    inputFormat="dd/MM/yyyy"
                                    value={fromDate}
                                    onChange={(value) => setFromDate(value)}
                                    renderInput={(props) => (
                                        <TextField
                                            required
                                            size={"small"}
                                            {...props}
                                            label="Работает с даты"
                                            fullWidth
                                            onBlur={handleBlur}
                                            error={!fromDate}
                                            helperText={!fromDate && 'Обязательно напишите дату начала работы'}
                                        />
                                    )}
                                />
                             </LocalizationProvider>

                             <StyledTextArea
                                 fullWidth
                                 multiline
                                 minRows={7.1}
                                 size="small"
                                 name="about"
                                 variant="outlined"
                                 label="О сотруднике"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.about || ""}
                                 error={Boolean(touched.about && errors.about)}
                                 helperText={touched.about && errors.about}
                             />
                          </Grid>
                       </Grid>

                       <FlexBox sx={{mb: 2, columnGap: "10px"}}>
                          <LoadingButton type="submit" color="primary" variant="contained" loading={loading}
                                         disabled={imageList.length < 1} sx={{px: 6}}>Сохранить</LoadingButton>
                          <Button onClick={() => navigate(-1)} type="button" color={"secondary"} variant={"outlined"}
                                  sx={{px: 6}}>Назад</Button>
                       </FlexBox>
                    </Form>
                )}
             </Formik>
          </Card>
       </Container>
   );
};

const productSchema = yup.object().shape({
   firstName: yup.string().required("Обязательно напишите имя"),
   lastName: yup.string().required("Обязательно напишите фамилию"),
   midName: yup.string().required("Обязательно напишите отчество"),
   about: yup.string().required("Обязательно напишите о сотруднике"),
   address: yup.string().required("Обязательно напишите адрес"),
   email: yup.string()
       .required("Обязательно напишите email")
       .email('Введите правильную почту'),
   phoneNumber: yup.string().required("Обязательно напишите номер телефона"),
   gender: yup.string().required("Обязательно выберите пол"),
   position: yup.string().required("Обязательно напишите должность")
});

export default TeamForm;