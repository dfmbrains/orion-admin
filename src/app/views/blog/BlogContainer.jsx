import {Grid} from "@mui/material";
import {Box} from "@mui/system";
import React, {Fragment, useState} from "react";
import ListBlogCard from "./ListBlogCard";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {deleteCollectionDocumentById} from "../../firebase/firestoreFirebase";
import {blogFirebasePath} from "../../utils/constant";
import {deleteFileFromFirebase} from "../../firebase/fileFirebase";

const BlogContainer = ({blogList, setBlogList}) => {
   const [confirmationDialogId, setConfirmationDialogId] = useState('')
   const [loading, setLoading] = useState(false)

   const handleDeletePost = async () => {
      setLoading(true)
      await deleteCollectionDocumentById(blogFirebasePath, confirmationDialogId)
      const postFiles = blogList.find(el => el.id === confirmationDialogId).images
      for (let i = 0; i < postFiles.length; i++) {
         deleteFileFromFirebase(`${blogFirebasePath}/${confirmationDialogId}/${postFiles[i].name}`)
      }
      setConfirmationDialogId('')
      setBlogList((prevState) => prevState.filter(post => post.id !== confirmationDialogId))
   }
   console.log(confirmationDialogId)
   return (
       <Fragment>
          <Box width="100%" height="100%" position="relative">
             <Grid container spacing={2}>
                {blogList.map((post) =>
                    <Grid item key={post.id} xs={6}>
                       <ListBlogCard post={post} loading={loading} confirmationDialogId={confirmationDialogId}
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
                  onYesClick={handleDeletePost}
              />
          )}
       </Fragment>
   );
};

export default BlogContainer;
