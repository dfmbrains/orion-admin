import {Button, ButtonGroup, Card, Divider, Grid, Icon, TextField} from "@mui/material";
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
import {serviceFirebasePath} from "../../utils/constant";
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

const ServiceForm = () => {
   const {id: postId} = useParams()

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
      title: "",
      subtitle: ""
   });
   const [content, setContent] = useState([{title: '', text: ''}])

   const handleContentChange = (index, key, value) => {
      setContent((prevState) => {
         const newState = [...prevState];
         newState[index] = {...newState[index], [key]: value};
         return newState;
      })
   }

   const handleSubmit = async (values) => {
      if (imageList.length === 0) {
         setImageListError(true)
      } else {
         setLoading(true)

         const uploadFileList = async (id) => {
            await uploadFileToFirebase(imageList[0], `${serviceFirebasePath}/${id}/${uuidv4()}`)
         }

         try {
            if (postId) {
               const createdData = {...values, id: postId, content, created: new Date()}
               if (!isImgsPrev) {
                  for (let i = 0; i < prevImgList.length; i++) {
                     deleteFileFromFirebase(`${serviceFirebasePath}/${postId}/${prevImgList[i].name}`)
                  }
                  await uploadFileList(postId)
               }
               await updateCollectionDocumentById(serviceFirebasePath, createdData, postId)
            } else {
               const id = uuidv4()

               await uploadFileList(id)
               await createCollectionDocument(serviceFirebasePath, {...values, content, id, created: new Date()})
            }

            navigate('/services')
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
      if (postId) {
         setLoading(true)
         getFileFromFirebase(`${serviceFirebasePath}/${postId}`)
             .then(fileResponse => {
                setPrevImgList(fileResponse)
                setImageList(fileResponse)
                setLoading(false)
             })
         getCollectionDocumentById(serviceFirebasePath, postId)
             .then(data => {
                setInitialValues({title: data.title, subtitle: data.subtitle})
                setContent(data.content)
             })
      }
   }, [postId])

   return (
       <Container>
          <div className="breadcrumb">
             <Breadcrumb routeSegments={[{
                name: "Список услуг",
                path: "/services"
             }, {name: postId ? "Редактирование" : 'Создание'}]}/>
          </div>

          <Card elevation={3}>
             <Box p={2} display="flex">
                <H4>{postId ? 'Редактировать' : 'Создать'} услугу</H4>
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
                                 name="title"
                                 label="Заголовок"
                                 size="small"
                                 variant="outlined"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.title || ""}
                                 error={Boolean(touched.title && errors.title)}
                                 helperText={touched.title && errors.title}
                             />
                             <StyledTextField
                                 fullWidth
                                 multiline
                                 size="small"
                                 name="subtitle"
                                 variant="outlined"
                                 label="Подзаголовок"
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.subtitle || ""}
                                 error={Boolean(touched.subtitle && errors.subtitle)}
                                 helperText={touched.subtitle && errors.subtitle}
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

                             {content.map((el, ind) => (
                                 <React.Fragment key={ind}>
                                    <H4 mt={2} mb={1} px={1}>Абзац {ind + 1}</H4>

                                    <StyledTextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        label="Заголовок абзаца"
                                        value={el.title}
                                        onChange={(e) => handleContentChange(ind, 'title', e.target.value)}
                                    />

                                    <StyledTextField
                                        fullWidth
                                        multiline
                                        minRows={5}
                                        size="small"
                                        variant="outlined"
                                        label="Текст абзаца"
                                        value={el.text}
                                        onChange={(e) => handleContentChange(ind, 'text', e.target.value)}
                                    />
                                 </React.Fragment>
                             ))}

                             <ButtonGroup fullWidth>
                                <Button disabled={content.length === 10}
                                        onClick={() => setContent((prevState) => [...prevState, {title: '', text: ''}])}
                                        mt={1} fullWidth type={"button"} color="secondary" variant="contained">Создать
                                   абзац</Button>
                                <Button disabled={content.length === 1}
                                        onClick={() => setContent((prevState) => prevState.slice(0, prevState.length - 1))}
                                        mt={1} fullWidth type={"button"} color="error" variant="contained">Удалить
                                   абзац</Button>
                             </ButtonGroup>
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
   title: yup.string()
       .required("Введите заголовок"),
   subtitle: yup.string()
       .required("Введите подзаголовок"),
});
export default ServiceForm;
