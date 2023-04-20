import {Box, Button, Card, Divider, Grid, Stack, styled, TextField} from "@mui/material";
import {FlexBox} from "app/components/FlexBox";
import {H5, Paragraph} from "app/components/Typography";
import {useFormik} from "formik";
import * as Yup from "yup";
import {checkPassword, handleResetPassword} from "../../firebase/authFirebase";
import React, {useState} from "react";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";
import useAuth from "../../hooks/useAuth";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {useSelector} from "react-redux";

const Dot = styled(Box)(({theme}) => ({
   width: 8,
   height: 8,
   flexShrink: 0,
   borderRadius: "50%",
   backgroundColor: theme.palette.primary.main,
}));

const Password = () => {
   const initialValues = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
   };

   const validationSchema = Yup.object({
      currentPassword: Yup.string()
          .required("Требуется текущий пароль!"),
      newPassword: Yup.string()
          .min(6, "Пароль должен состоять не менее чем из 6 символов.")
          .matches(/^(?=.*[a-z])/, 'Пароль должен содержать хотя бы один символ в нижнем регистре.')
          .matches(/^(?=.*[A-Z])/, 'Пароль должен содержать хотя бы один символ в верхнем регистре.')
          .matches(/^(?=.*[0-9])/, 'Пароль должен содержать хотя бы одну цифру.')
          .required("Введите новый пароль"),
      confirmNewPassword: Yup.string()
          .required("Подтвердите новый пароль")
          .oneOf(
              [Yup.ref("newPassword"), null], "Пароли не совпадают"
          )
   });

   const {constants} = useSelector((state) => state.constants);
   const {user} = useAuth();
   const {enqueueSnackbar} = useSnackbar();
   const [loading, setLoading] = useState(false)
   const [confirmationDialog, setConfirmationDialog] = useState(false)

   const {values, resetForm, errors, handleSubmit, handleChange, handleBlur, touched} = useFormik({
      initialValues,
      validationSchema,
      onSubmit: () => setConfirmationDialog(true)
   });

   const handleUpdate = async () => {
      setConfirmationDialog(false)
      setLoading(true)

      try {
         await checkPassword(user.email, values.currentPassword)
         await handleResetPassword(user.email)
         enqueueSnackbar("Инструкция отправлена на почту", {variant: "success"})
      } catch (e) {
         enqueueSnackbar(`${e.message}`, {variant: "error"})
      }
      setLoading(false)
      resetForm()
   }

   return (
       <Card>
          {confirmationDialog && (
              <ConfirmationDialog
                  password={constants?.passwordForEdit || ''}
                  text="Введите пароль для редактирования"
                  open={confirmationDialog}
                  onConfirmDialogClose={() => setConfirmationDialog(false)}
                  onYesClick={handleUpdate}
              />
          )}

          <H5 padding={3}>Пароль</H5>
          <Divider/>

          <Box padding={3}>
             <Grid container spacing={5}>
                <Grid item sm={6} xs={12}>
                   <form onSubmit={handleSubmit}>
                      <Stack spacing={4}>
                         <TextField
                             fullWidth
                             type="password"
                             variant="outlined"
                             name="currentPassword"
                             label="Действующий пароль"
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.currentPassword}
                             helperText={touched.currentPassword && errors.currentPassword}
                             error={Boolean(touched.currentPassword && errors.currentPassword)}
                         />

                         <TextField
                             fullWidth
                             type="password"
                             name="newPassword"
                             variant="outlined"
                             label="Новый пароль"
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.newPassword}
                             helperText={touched.newPassword && errors.newPassword}
                             error={Boolean(touched.newPassword && errors.newPassword)}
                         />
                         <TextField
                             fullWidth
                             type="password"
                             variant="outlined"
                             name="confirmNewPassword"
                             label="Подтвердите пароль"
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.confirmNewPassword}
                             helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                             error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                         />
                      </Stack>

                      <Stack direction="row" spacing={3} mt={4}>
                         <LoadingButton loading={loading} type="submit" variant="contained">
                            Сохранить
                         </LoadingButton>
                         <Button type={"button"} onClick={resetForm} variant="outlined">Отменить</Button>
                      </Stack>
                   </form>
                </Grid>

                <Grid item sm={6} xs={12}>
                   <H5>Требования к паролю:</H5>
                   <Paragraph lineHeight={1.7}>Убедитесь, что эти требования соблюдены:</Paragraph>

                   <Stack spacing={1} mt={2}>
                      <FlexBox alignItems="center" gap={1}>
                         <Dot/>
                         <Paragraph fontSize={13}>
                            Минимум 6 символов - чем больше, тем лучше.
                         </Paragraph>
                      </FlexBox>

                      <FlexBox alignItems="center" gap={1}>
                         <Dot/>
                         <Paragraph fontSize={13}>
                            Как минимум один строчный символ
                         </Paragraph>
                      </FlexBox>

                      <FlexBox alignItems="center" gap={1}>
                         <Dot/>
                         <Paragraph fontSize={13}>
                            Хотя бы один символ в верхнем регистре
                         </Paragraph>
                      </FlexBox>

                      <FlexBox alignItems="center" gap={1}>
                         <Dot/>
                         <Paragraph fontSize={13}>
                            Не менее одного числа или символа
                         </Paragraph>
                      </FlexBox>
                   </Stack>
                </Grid>
             </Grid>
          </Box>
       </Card>
   );
};

export default Password;
