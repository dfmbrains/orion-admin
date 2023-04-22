import {Button, Hidden, styled} from "@mui/material";
import React, {useEffect, useState} from "react";
import GridView from "./GridView";
import {Breadcrumb} from "../../components";
import {useNavigate} from "react-router-dom";
import {getAllCollection} from "../../firebase/firestoreFirebase";
import {partnersFirebasePath} from "../../utils/constant";
import {getFileFromFirebase} from "../../firebase/fileFirebase";

const Container = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},

   "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: {marginBottom: "16px"},
   }
}));

const PartnersList = () => {
   const navigate = useNavigate()

   const [list, setList] = useState(null);

   useEffect(() => {
      getAllCollection(partnersFirebasePath)
          .then(data => {
             const createdData = data.map(post => {
                return getFileFromFirebase(`${partnersFirebasePath}/${post.id}`)
                    .then(images => ({...post, images}))
             })
             return Promise.all(createdData)
          })
          .then(createdData => setList(createdData))
   }, [])

   return (
       <Container className="list">
          <div className="breadcrumb">
             <Breadcrumb routeSegments={[{name: "Список партнеров"}]}/>
          </div>

          <Button sx={{mb: 2}} color="primary" variant="contained" onClick={() => navigate('create')}>Добавить
             партнера</Button>

          <Hidden xsDown>
             <GridView list={list} setList={setList}></GridView>
          </Hidden>

          <Hidden smUp>
             <GridView list={list} setList={setList}></GridView>
          </Hidden>
       </Container>
   );
};

export default PartnersList;
