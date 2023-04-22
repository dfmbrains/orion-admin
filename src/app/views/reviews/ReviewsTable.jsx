import {
   Card,
   Collapse,
   Divider,
   Icon,
   IconButton,
   styled,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   useTheme
} from "@mui/material";
import Breadcrumb from "app/components/Breadcrumb";
import {themeShadows} from "app/components/MatxTheme/themeColors";
import React, {useEffect, useState} from "react";
import {
   deleteCollectionDocumentById,
   getAllCollection,
   updateCollectionDocumentById
} from "../../firebase/firestoreFirebase";
import {reviewsFirebasePath} from "../../utils/constant";
import {formatFirebaseTimestamp} from "../../utils/utils";
import {MatxLoading} from "../../components";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ConfirmationDialog from "../../components/ConfirmationDialog";

const Container = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},
   "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: {marginBottom: "16px"},
   },
}));

const LoadingBox = styled("div")(() => ({
   display: "flex",
   minHeight: "60vh",
   alignItems: "center",
   justifyContent: "center",
}));

const ProductTable = styled(Table)(() => ({
   minWidth: 750,
   whiteSpace: "pre",
   "& thead": {"& th:first-of-type": {paddingLeft: 16}},
   "& td": {borderBottom: "none"},
   "& td:first-of-type": {paddingLeft: "16px !important"},
}));

const Status = styled("small")(() => ({
   color: "#fff",
   padding: "3px 8px",
   overflow: "hidden",
   borderRadius: "300px",
   boxShadow: themeShadows[3],
}));

const ReviewsRow = ({setReviewActionDialog, item, index, handleDeleteReview, handleUpdateReviewStatus}) => {
   const theme = useTheme()

   const [open, setOpen] = useState(false);

   return (
       <>
          <TableRow hover>
             <TableCell colSpan={1}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                   {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
             </TableCell>

             <TableCell sx={{px: 0}} align={"left"} colSpan={1}>
                {index + 1}
             </TableCell>

             <TableCell sx={{px: 0}} align={"center"} colSpan={2}>
                {item.name}
             </TableCell>

             <TableCell sx={{px: 0}} align={"center"} colSpan={2}>
                {item.company}
             </TableCell>

             <TableCell sx={{px: 0}} align={"center"} colSpan={2}>
                {formatFirebaseTimestamp(item.created)}
             </TableCell>

             <TableCell sx={{px: 0}} align={"center"} colSpan={2}>
                {item.status
                    ?
                    <Status sx={{backgroundColor: theme.palette.success.main}}>Опубликован</Status>
                    :
                    <Status sx={{backgroundColor: theme.palette.primary.main}}>Не
                       опубликован</Status>
                }
             </TableCell>

             <TableCell sx={{px: 0}} align={"center"} colSpan={2}>
                <IconButton onClick={() => setReviewActionDialog({
                   text: 'Вы уверены что хотите опубликовать?',
                   action: () => handleUpdateReviewStatus(item.id, true)
                })}>
                   <Icon color={"success"}>add_task</Icon>
                </IconButton>
                <IconButton onClick={() => setReviewActionDialog({
                   text: 'Вы уверены что хотите скрыть?',
                   action: () => handleUpdateReviewStatus(item.id, false)
                })}>
                   <Icon color={"primary"}>block</Icon>
                </IconButton>
                <IconButton onClick={() => setReviewActionDialog({
                   text: 'Вы уверены что хотите удалить?',
                   action: () => handleDeleteReview(item.id)
                })}>
                   <Icon color={"error"}>delete</Icon>
                </IconButton>
             </TableCell>
          </TableRow>

          <TableRow>
             <TableCell colSpan={12} sx={{px: 2, py: 0}}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                   <p>{item.text}</p>
                   <Divider/>
                </Collapse>
             </TableCell>
          </TableRow>
       </>
   )
}

const ReviewsTable = () => {
   const [reviewsList, setReviewsList] = useState(null);
   const [reviewActionDialog, setReviewActionDialog] = useState(null);

   useEffect(() => {
      getAllCollection(reviewsFirebasePath)
          .then(data => setReviewsList(data))
   }, []);

   const handleDeleteReview = async (id) => {
      setReviewActionDialog(null)

      const duplicate = [...reviewsList]
      setReviewsList(null)
      try {
         await deleteCollectionDocumentById(reviewsFirebasePath, id)

         setReviewsList(duplicate.filter(el => el.id !== id))
      } catch (e) {
         console.log(e);
         setReviewsList(duplicate)
      }
   }

   const handleUpdateReviewStatus = async (id, status) => {
      setReviewActionDialog(null)

      const duplicate = [...reviewsList]
      setReviewsList(null)
      try {
         const itemIndex = duplicate.findIndex(el => el.id === id)
         const updated = {...duplicate[itemIndex], status}

         await updateCollectionDocumentById(reviewsFirebasePath, updated, id)

         duplicate[itemIndex] = updated

         setReviewsList(duplicate)
      } catch (e) {
         console.log(e);
         setReviewsList(duplicate)
      }
   }

   return (
       <Container>
          <div className="breadcrumb">
             <Breadcrumb routeSegments={[{name: "Оставленные отзывы"}]}/>
          </div>

          {reviewsList
              ? <Card sx={{width: "100%", overflow: "auto"}} elevation={6}>
                 <ProductTable>
                    <TableHead>
                       <TableRow>
                          <TableCell align={"left"} colSpan={1}></TableCell>
                          <TableCell align={"left"} colSpan={1}>№</TableCell>
                          <TableCell align={"center"} colSpan={2}>Имя</TableCell>
                          <TableCell align={"center"} colSpan={2}>Компания</TableCell>
                          <TableCell align={"center"} colSpan={2}>Создано</TableCell>
                          <TableCell align={"center"} colSpan={2}>Статус</TableCell>
                          <TableCell align={"center"} colSpan={2}>Действия</TableCell>
                       </TableRow>
                    </TableHead>

                    <TableBody>
                       {reviewsList.map((item, index) => (
                           <ReviewsRow setReviewActionDialog={setReviewActionDialog} item={item} index={index}
                                       key={item.id} handleDeleteReview={handleDeleteReview}
                                       handleUpdateReviewStatus={handleUpdateReviewStatus}/>
                       ))}
                    </TableBody>
                 </ProductTable>
              </Card>
              : <LoadingBox>
                 <MatxLoading/>
              </LoadingBox>
          }

          {reviewActionDialog && (
              <ConfirmationDialog
                  text={reviewActionDialog?.text}
                  open={!!reviewActionDialog}
                  onConfirmDialogClose={() => setReviewActionDialog(null)}
                  onYesClick={reviewActionDialog?.action}
              />
          )}
       </Container>
   );
};

export default ReviewsTable;
