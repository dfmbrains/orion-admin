import {Avatar, Button, Card, Grid} from "@mui/material";
import {Box} from "@mui/system";
import {Breadcrumb, MatxLoading} from "app/components";
import {FlexBetween, FlexBox} from "app/components/FlexBox";
import {H5} from "app/components/Typography";
import React, {useEffect, useState} from "react";
import {Container, StyledButton, StyledP} from "./styles";
import {getAllCollection} from "../../firebase/firestoreFirebase";
import {formatName} from "../../utils/utils";
import {getFileFromFirebase} from "../../firebase/fileFirebase";
import {useNavigate} from "react-router-dom";
import {teamFirebasePath} from "../../utils/constant";

const TeamList = () => {
   const [isAlive, setIsAlive] = useState(true);
   const [userList, setUserList] = useState(null);

   useEffect(() => {
      getAllCollection(teamFirebasePath)
          .then(data => {
             const createdData = data.map(member => {
                return getFileFromFirebase(`${teamFirebasePath}/${member.id}`)
                    .then(file => ({...member, photo: file[0]}))
             })
             return Promise.all(createdData)
          })
          .then(createdData => setUserList(createdData))
      return () => setIsAlive(false);
   }, [isAlive]);

   const navigate = useNavigate()

   return (
       userList
           ? <Container>
              <div className="breadcrumb">
                 <Breadcrumb routeSegments={[{name: "Список сотрудников"}]}/>
              </div>

              <Button sx={{mb: 2}} color="primary" variant="contained" onClick={() => navigate('create')}>Добавить
                 сотрудника</Button>

              <Grid container spacing={3}>
                 {userList.length > 0 && (
                     userList.map(user => (
                         <Grid key={user.id} item sm={6} xs={12}>
                            <Card>
                               <FlexBetween p="24px" m={-1} flexWrap="wrap">
                                  <FlexBox alignItems="center" m={1}>
                                     <Avatar src={user.photo.file} sx={{width: 48, height: 48}}/>

                                     <Box ml={2}>
                                        <H5>{formatName(user.firstName, user.midName, user.lastName)}</H5>
                                        <StyledP sx={{mt: 1, fontWeight: "normal", textTransform: "capitalize"}}>
                                           {user.position}
                                        </StyledP>
                                     </Box>
                                  </FlexBox>

                                  <Box m={1} display="flex">
                                     <StyledButton onClick={() => navigate(`view/${user.id}`)}
                                                   size="small">Профиль</StyledButton>
                                  </Box>
                               </FlexBetween>
                            </Card>
                         </Grid>
                     ))
                 )}
              </Grid>
           </Container>
           : <MatxLoading/>
   );
};

export default TeamList;