import {Grid} from "@mui/material";
import {Box} from "@mui/system";
import React, {Fragment, useState} from "react";
import ListServiceCard from "./ListServiceCard";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {deleteCollectionDocumentById} from "../../firebase/firestoreFirebase";
import {serviceFirebasePath} from "../../utils/constant";
import {deleteFileFromFirebase} from "../../firebase/fileFirebase";

const ServiceContainer = ({serviceList, setServiceList}) => {
   const [confirmationDialogId, setConfirmationDialogId] = useState('')
   const [loading, setLoading] = useState(false)

   const handleDeleteService = async () => {
      setLoading(true)
      await deleteCollectionDocumentById(serviceFirebasePath, confirmationDialogId)
      const serviceFiles = serviceList.find(el => el.id === confirmationDialogId).images
      for (let i = 0; i < serviceFiles.length; i++) {
         deleteFileFromFirebase(`${serviceFirebasePath}/${confirmationDialogId}/${serviceFiles[i].name}`)
      }
      setConfirmationDialogId('')
      setServiceList((prevState) => prevState.filter(post => post.id !== confirmationDialogId))
      setLoading(false)
   }

   return (
       <Fragment>
          <Box width="100%" height="100%" position="relative">
             <Grid container spacing={2}>
                {serviceList.map((service) =>
                    <Grid item key={service.id} xs={6}>
                       <ListServiceCard service={service} loading={loading} confirmationDialogId={confirmationDialogId}
                                        setConfirmationDialogId={setConfirmationDialogId}/>
                    </Grid>
                )}
             </Grid>
          </Box>

          {confirmationDialogId && (
              <ConfirmationDialog
                  text="Вы уверены что хотите удалить?"
                  open={!!confirmationDialogId && !loading}
                  onConfirmDialogClose={() => setConfirmationDialogId('')}
                  onYesClick={handleDeleteService}
              />
          )}
       </Fragment>
   );
};

export default ServiceContainer;
