import {Button, Card, Grid, styled, useTheme} from "@mui/material";
import {FlexAlignCenter, FlexGap10} from "app/components/FlexBox";
import {H3, H5} from "app/components/Typography";
import React from "react";
import {formatFirebaseTimestamp} from "../../utils/utils";
import {useNavigate} from "react-router-dom";
import {LoadingButton} from "@mui/lab";

const ProductCard = styled(Card)(() => ({
   padding: 16,
   position: "relative",
   height: "100% !important",
   "&:hover": {"& .image-box-overlay": {opacity: 1}},
}));

const IMG = styled("img")(() => ({width: "100%", height: "130px"}));

const StyledButtonGroup = styled(FlexGap10)(() => ({
   bottom: 0,
   right: 0,
   zIndex: 2,
   position: "absolute",
}));

const ListServiceCard = ({service, loading, confirmationDialogId, setConfirmationDialogId}) => {
   const theme = useTheme();

   const navigate = useNavigate()

   return (
       <ProductCard elevation={3}>
          <Grid container spacing={2}>
             <Grid item lg={6} md={6} sm={6} xs={12}>
                <FlexAlignCenter position="relative">
                   <IMG src={service.images[0].file} alt={service.title}/>
                </FlexAlignCenter>
             </Grid>

             <Grid item sm={6} xs={12} sx={{p: "12px", position: "relative"}}>
                <H3>{service.title}</H3>

                <H5 mb={2} sx={{color: theme.palette.text.secondary}}>{formatFirebaseTimestamp(service.created)}</H5>

                {/*<Paragraph sx={{mb: 2, color: theme.palette.text.secondary}}>*/}
                {/*   {service.subtitle.substring(0, 200)}*/}
                {/*</Paragraph>*/}


                <StyledButtonGroup>
                   <Button onClick={() => navigate(`edit/${service.id}`)} variant={"outlined"} color={"success"}
                           size={"small"}>Редактировать</Button>
                   <LoadingButton onClick={() => setConfirmationDialogId(service.id)}
                                  loading={loading && confirmationDialogId === service.id} variant={"contained"}
                                  color={"error"} size={"small"}>Удалить</LoadingButton>
                </StyledButtonGroup>
             </Grid>
          </Grid>
       </ProductCard>
   );
};

export default ListServiceCard;
