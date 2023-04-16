import {Card, Divider, Icon, Tooltip} from "@mui/material";
import {styled} from "@mui/system";
import {FlexBox} from "app/components/FlexBox";
import {H5} from "app/components/Typography";
import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {deleteCollectionDocumentById} from "../../../firebase/firestoreFirebase";
import {LoadingButton} from "@mui/lab";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import {deleteFileFromFirebase} from "../../../firebase/fileFirebase";
import {teamFirebasePath} from "../../../utils/constant";

const ContentBox = styled(FlexBox)(() => ({
   marginBottom: "16px",
   alignItems: "center",
   columnGap: "16px"
}));

const StyledButton = styled(LoadingButton)(() => ({
   fontSize: "13px",
   marginBottom: "16px"
}));

const TeamMemberActions = ({teamMemberData}) => {
   const {id} = useParams()
   const navigate = useNavigate()

   const [loading, setLoading] = useState(false)
   const [shouldOpenConfirmationDialog, setShouldOpenConfirmationDialog] = useState(false)

   const deleteTeamMember = async () => {
      setLoading(true)
      setShouldOpenConfirmationDialog(false)
      await deleteCollectionDocumentById(teamFirebasePath, id)
      deleteFileFromFirebase(`${teamFirebasePath}/${id}/${teamMemberData.photo.name}`)
      navigate('/team')
   }

   return (
       <Card elevation={3} sx={{marginTop: "16px"}}>
          <H5 sx={{p: 2}}>Действия</H5>
          <Divider sx={{mb: 2}}/>

          <ContentBox px={2}>
             <StyledButton onClick={() => navigate(`/team/edit/${id}`)} startIcon={<Icon fontSize="small">edit</Icon>}
                           variant={"outlined"} color={"success"}>Редактировать профиль</StyledButton>

             <Tooltip title="После удаления аккаунта данные будут потеряны навсегда." placement="bottom-start">
                <StyledButton onClick={() => setShouldOpenConfirmationDialog(true)} loading={loading}
                              variant="contained" color={"error"} startIcon={<Icon>delete</Icon>}>Удалить
                   сотрудника</StyledButton>
             </Tooltip>
          </ContentBox>

          {shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                  text="Вы уверены что хотите удалить?"
                  open={shouldOpenConfirmationDialog}
                  onConfirmDialogClose={() => setShouldOpenConfirmationDialog(false)}
                  onYesClick={deleteTeamMember}
              />
          )}
       </Card>
   );
};

export default TeamMemberActions;
