import {Card, Divider, Grid, Icon, TextField} from "@mui/material";
import {Box, styled, useTheme} from "@mui/system";
import {Breadcrumb} from "app/components";
import {FlexAlignCenter, FlexBox} from "app/components/FlexBox";
import {H4} from "app/components/Typography";
import {convertHexToRGB} from "app/utils/utils";
import {Formik} from "formik";
import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import * as yup from "yup";
import {v4 as uuidv4} from "uuid";
import {
   createCollectionDocument,
   getCollectionDocumentById,
   updateCollectionDocumentById
} from "../../firebase/firestoreFirebase";
import {partnersFirebasePath} from "../../utils/constant";
import {LoadingButton} from "@mui/lab";
import {useNavigate, useParams} from "react-router-dom";
import {deleteFileFromFirebase, getFileFromFirebase, uploadFileToFirebase} from "../../firebase/fileFirebase";

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

const DropZone = styled(FlexAlignCenter)(({isDragActive, theme, borderColor}) => ({
   height: 160,
   width: "100%",
   cursor: "pointer",
   borderRadius: "4px",
   marginBottom: "16px",
   transition: "all 350ms ease-in-out",
   border: `2px dashed rgba(${convertHexToRGB(borderColor)}, 0.3)`,
   "&:hover": {
      background: `rgb(${convertHexToRGB(theme.palette.text.primary)}, 0.2) !important`,
   },
   background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));

const PartnersForm = () => {
   const {id: partnerId} = useParams()

   const navigate = useNavigate()
   const {palette} = useTheme();
   const textMuted = palette.text.secondary;
   const textError = palette.error.main;

   const [loading, setLoading] = useState(false)

   const [isImgsPrev, setIsImgsPrev] = useState(true)
   const [imageList, setImageList] = useState([]);
   const [prevImgList, setPrevImgList] = useState([]);
   const [imageListError, setImageListError] = useState(false);
   const {getRootProps, getInputProps, acceptedFiles} = useDropzone({accept: "image/*"})

   const [initialValues, setInitialValues] = useState({
      name: "",
      email: ""
   });

   const handleSubmit = async (values) => {
      if (imageList.length === 0) {
         setImageListError(true)
      } else {
         setLoading(true)

         const uploadFileList = async (id) => {
            await uploadFileToFirebase(imageList[0], `${partnersFirebasePath}/${id}/${uuidv4()}`)
         }

         try {
            if (partnerId) {
               const createdData = {...values, id: partnerId, created: new Date()}
               if (!isImgsPrev) {
                  for (let i = 0; i < prevImgList.length; i++) {
                     deleteFileFromFirebase(`${partnersFirebasePath}/${partnerId}/${prevImgList[i].name}`)
                  }
                  await uploadFileList(partnerId)
               }
               await updateCollectionDocumentById(partnersFirebasePath, createdData, partnerId)
            } else {
               const id = uuidv4()

               await uploadFileList(id)
               await createCollectionDocument(partnersFirebasePath, {...values, id, created: new Date()})
            }

            navigate('/partners')
         } catch (error) {
            console.log(error)
            setLoading(false)
         }
      }
   };

   useEffect(() => {
      if (acceptedFiles.length > 0) {
         setIsImgsPrev(false)
      }
      setImageList(acceptedFiles);
   }, [acceptedFiles]);

   useEffect(() => {
      if (partnerId) {
         setLoading(true)
         getFileFromFirebase(`${partnersFirebasePath}/${partnerId}`)
             .then(fileResponse => {
                setPrevImgList(fileResponse)
                setImageList(fileResponse)
                setLoading(false)
             })
         getCollectionDocumentById(partnersFirebasePath, partnerId)
             .then(data => setInitialValues({name: data.name, email: data.email}))
      }
   }, [partnerId])

   return (
       <Container>
          <div className="breadcrumb">
             <Breadcrumb routeSegments={[{
                name: "Список партнеров",
                path: "/partners"
             }, {name: partnerId ? "Редактирование" : 'Создание'}]}/>
          </div>

          <Card elevation={3}>
             <Box p={2} display="flex">
                <H4>{partnerId ? 'Редактировать' : 'Создать'} партнера</H4>
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
                     handleSubmit,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                       <Grid container spacing={3} mb={5}>
                          <Grid item sm={6} xs={12}>
                             <StyledTextField
                                 fullWidth
                                 name="name"
                                 label="Название"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.name || ""}
                                 error={Boolean(touched.name && errors.name)}
                                 helperText={touched.name && errors.name}
                             />
                             <StyledTextField
                                 fullWidth
                                 multiline
                                 size="small"
                                 name="email"
                                 variant="outlined"
                                 label="Электронная почта"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.email || ""}
                                 error={Boolean(touched.email && errors.email)}
                                 helperText={touched.email && errors.email}
                             />

                             <DropZone borderColor={imageListError ? textError : palette.text.primary}
                                       multiple={false} {...getRootProps()}>
                                <input multiple={false} {...getInputProps()} />
                                <FlexBox alignItems="center" flexDirection="column">
                                   <Icon sx={{
                                      color: imageListError ? textError : textMuted,
                                      fontSize: "48px"
                                   }}>publish</Icon>
                                   {imageList.length ? (
                                       <span>{imageList.length} фотографий выбрано</span>
                                   ) : (
                                       <span style={{color: imageListError ? textError : palette.text.primary}}>Нажмите, чтобы загрузить</span>
                                   )}
                                </FlexBox>
                             </DropZone>
                          </Grid>
                       </Grid>

                       <LoadingButton loading={loading} type="submit" color="primary" variant="contained"
                                      sx={{mb: 2, px: 6}}>Сохранить</LoadingButton>
                    </Form>
                )}
             </Formik>
          </Card>
       </Container>
   );
};

const productSchema = yup.object().shape({
   name: yup.string()
       .required("Введите заголовок"),
   email: yup.string()
       .email("Неправильная электронная почта.")
       .required("Введите электронную почту"),
});
export default PartnersForm;
