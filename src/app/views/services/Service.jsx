import {Button, styled} from "@mui/material";
import {Breadcrumb, MatxLoading, MatxSidenavContainer, MatxSidenavContent} from "app/components";
import React, {useEffect, useState} from "react";
import ServiceContainer from "./ServiceContainer";
import {getAllCollection} from "../../firebase/firestoreFirebase";
import {serviceFirebasePath} from "../../utils/constant";
import {getFileFromFirebase} from "../../firebase/fileFirebase";
import {useNavigate} from "react-router-dom";

const ShopRoot = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},

   "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: {marginBottom: "16px"},
   }
}));

const Service = () => {
   const navigate = useNavigate()

   const [serviceList, setServiceList] = useState(null)

   useEffect(() => {
      getAllCollection(serviceFirebasePath)
          .then(data => {
             const createdData = data.map(post => {
                return getFileFromFirebase(`${serviceFirebasePath}/${post.id}`)
                    .then(images => ({...post, images}))
             })
             return Promise.all(createdData)
          })
          .then(createdData => setServiceList(createdData))
   }, []);
   console.log(serviceList)

   return (
       serviceList
           ? <ShopRoot className="shop">
              <MatxSidenavContainer>
                 <MatxSidenavContent>
                    <div className="breadcrumb">
                       <Breadcrumb routeSegments={[{name: "Список услуг"}]}/>
                    </div>

                    <Button sx={{mb: 2}} color="primary" variant="contained" onClick={() => navigate('create')}>Добавить
                       услугу</Button>

                    <ServiceContainer serviceList={serviceList} setServiceList={setServiceList}/>
                 </MatxSidenavContent>
              </MatxSidenavContainer>
           </ShopRoot>
           : <MatxLoading/>
   );
};

export default Service;
