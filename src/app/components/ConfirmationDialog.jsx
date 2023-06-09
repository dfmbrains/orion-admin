import {Button, Dialog, TextField} from "@mui/material";
import {styled} from "@mui/system";
import React, {useState} from "react";

const DialogBox = styled("div")(() => ({
   width: 360,
   padding: "24px 16px 16px",
   textAlign: "center",
   marginLeft: "auto",
   marginRight: "auto",
}));

const Title = styled("h4")(() => ({
   margin: 0,
   marginBottom: "8px",
   textTransform: "capitalize",
}));

const Controller = styled("div")(() => ({
   margin: "8px",
   paddingTop: "8px",
   display: "flex",
   justifyContent: "center",
}));

const StyledButton = styled(Button)(({theme}) => ({
   margin: "8px",
   overflow: "hidden",
   borderRadius: "300px",
   width: "50%",
   transition: "all 250ms",
   "&.yesBtn": {
      "&:hover": {
         color: "#ffffff",
         background: `${theme.palette.error.main} !important`,
         backgroundColor: `${theme.palette.error.main} !important`,
         fallbacks: [{color: "white !important"}],
      },
   },
   "&.noBtn": {
      "&:hover": {
         color: "#ffffff",
         background: `${theme.palette.secondary.main} !important`,
         backgroundColor: `${theme.palette.secondary.main} !important`,
         fallbacks: [{color: "white !important"}],
      },
   },
}));

const ConfirmationDialog = ({
                               open,
                               text,
                               onYesClick,
                               onConfirmDialogClose,
                               title = "Подтверждение",
                               password
                            }) => {
   const [writtenPass, setWrittenPass] = useState('')

   return (
       <Dialog maxWidth="xs" open={open} onClose={onConfirmDialogClose}>
          <DialogBox>
             <Title>{title}</Title>
             <p>{text}</p>

             {password
                 ? <>
                    <TextField
                        sx={{my: 2}}
                        fullWidth
                        size={"small"}
                        name="pass"
                        label="Пароль"
                        variant="outlined"
                        onChange={(e) => setWrittenPass(e.target.value)}
                        value={writtenPass}
                    />
                    {password === writtenPass
                        ? <Button className="yesBtn" variant="outlined" color="error" fullWidth
                                  onClick={onYesClick}>Подтвердить</Button>
                        : <Button className="yesBtn" variant="outlined" color="error" disabled={true} fullWidth>Неправильный
                           пароль</Button>
                    }
                 </>
                 : <Controller>
                    <StyledButton className="yesBtn" variant="outlined" color="error"
                                  onClick={onYesClick}>Да</StyledButton>
                    <StyledButton className="noBtn" variant="outlined" color="secondary"
                                  onClick={onConfirmDialogClose}>Нет</StyledButton>
                 </Controller>
             }
          </DialogBox>
       </Dialog>
   );
};

export default ConfirmationDialog;
