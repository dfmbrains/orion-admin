import {Box, Card, Grid, Icon, styled} from "@mui/material";
import {H4, Small} from "app/components/Typography";
import React, {useState} from "react";
import {MatxLoading} from "../../components";
import {FlexBetween} from "../../components/FlexBox";
import {useNavigate} from "react-router-dom";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {deleteCollectionDocumentById} from "../../firebase/firestoreFirebase";
import {partnersFirebasePath} from "../../utils/constant";
import {deleteFileFromFirebase} from "../../firebase/fileFirebase";

const StyledIcon = styled(Icon)(() => ({
   color: "#fff",
   cursor: "pointer",
   marginRight: "12px",
}));

const IMG = styled("img")(() => ({
   width: "90%",
   display: "block",
   margin: "0 auto"
}));

const CardRoot = styled(Card)(() => ({
   height: "100%",
   display: "flex",
   flexDirection: "column",

   "& .grid__card-overlay": {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      opacity: 0,
      transition: "all 250ms ease-in-out",
      background: "rgba(0, 0, 0, 0.67)",
      "& > div:nth-of-type(2)": {
         position: "absolute",
         top: 0,
         bottom: 0,
         right: 0,
         left: 0,
         zIndex: -1,
      },
   },
   "& .grid__card-top": {
      padding: "10px 0",
      textAlign: "center",
      position: "relative",
   },
   "& .grid__card-bottom": {
      textAlign: "center"
   },
   "&:hover": {
      "& .grid__card-overlay": {opacity: 1},
   },
}));

const GridView = ({list, setList}) => {
   const navigate = useNavigate()

   const [confirmationDialogId, setConfirmationDialogId] = useState('')
   const [loading, setLoading] = useState(false)
   const handleDeletePartner = async () => {
      setLoading(true)
      try {
         await deleteCollectionDocumentById(partnersFirebasePath, confirmationDialogId)
         const serviceFiles = list.find(el => el.id === confirmationDialogId).images
         for (let i = 0; i < serviceFiles.length; i++) {
            deleteFileFromFirebase(`${partnersFirebasePath}/${confirmationDialogId}/${serviceFiles[i].name}`)
         }
         setConfirmationDialogId('')
         setList((prevState) => prevState.filter(post => post.id !== confirmationDialogId))
      } catch (e) {
         console.log(e);
      }
      setLoading(false)
   }

   return (
       <div>
          <Grid container spacing={2}>
             {list
                 ? list.map((item) => (
                     <Grid item key={item.id} sm={3}>
                        <CardRoot elevation={6}>
                           <Box className="grid__card-top">
                              <IMG src={item.images[0].file} alt={item.images[0].name}/>

                              <Box className="grid__card-overlay">
                                 <FlexBetween pt={1} sx={{justifyContent: "flex-end"}}>
                                    <StyledIcon onClick={() => navigate(`edit/${item.id}`)}
                                                fontSize="small">edit</StyledIcon>
                                    <StyledIcon onClick={() => setConfirmationDialogId(item.id)}
                                                fontSize="small">delete</StyledIcon>
                                 </FlexBetween>
                              </Box>
                           </Box>

                           <Box pb={1} className="grid__card-bottom">
                              <H4 mb={1}>{item.name}</H4>
                              <a href={`mailto:${item.email}`}>
                                 <Small sx={{display: "block"}}>{item.email}</Small>
                              </a>
                           </Box>
                        </CardRoot>

                        {confirmationDialogId && (
                            <ConfirmationDialog
                                text="Вы уверены что хотите удалить?"
                                open={!!confirmationDialogId && !loading}
                                onConfirmDialogClose={() => setConfirmationDialogId('')}
                                onYesClick={handleDeletePartner}
                            />
                        )}
                     </Grid>
                 ))
                 : <MatxLoading/>
             }
          </Grid>
       </div>
   );
};

export default GridView;
