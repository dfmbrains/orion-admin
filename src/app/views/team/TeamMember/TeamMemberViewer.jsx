import {Divider, Tab, Tabs} from "@mui/material";
import {styled} from "@mui/system";
import {Breadcrumb, MatxLoading} from "app/components";
import React, {useEffect, useState} from "react";
import TeamMemberDetails from "./TeamMemberDetails";
import {getCollectionDocumentById} from "../../../firebase/firestoreFirebase";
import {useParams} from "react-router-dom";
import {getFileFromFirebase} from "../../../firebase/fileFirebase";
import {teamFirebasePath} from "../../../utils/constant";

const Container = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},
   "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: {marginBottom: "16px"},
   },
}));

const TeamMemberViewer = () => {
   const {id} = useParams()

   const [tabIndex, setTabIndex] = useState(0);
   const [teamMemberData, setTeamMemberData] = useState(null)

   const handleTabChange = (e, value) => {
      setTabIndex(value);
   };

   useEffect(() => {
      getCollectionDocumentById(teamFirebasePath, id)
          .then(data => {
             return getFileFromFirebase(`${teamFirebasePath}/${id}`)
                 .then(file => ({...data, photo: file[0]}))
          })
          .then(createdData => setTeamMemberData(createdData))
   }, [id])

   return (
       teamMemberData
           ? <Container>
              <div className="breadcrumb">
                 <Breadcrumb
                     routeSegments={[{name: "Список сотрудников", path: "/team"}, {name: teamMemberData.firstName}]}/>
              </div>
              <Tabs
                  sx={{mt: 2}}
                  value={tabIndex}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
              >
                 {tabList.map((item, ind) => (
                     <Tab key={ind} value={ind} label={item} sx={{textTransform: "capitalize"}}/>
                 ))}
              </Tabs>
              <Divider sx={{mb: "24px"}}/>

              {tabIndex === 0 && <TeamMemberDetails teamMemberData={teamMemberData}/>}
           </Container>
           : <MatxLoading/>
   );
};

const tabList = ["Информация"];

export default TeamMemberViewer;
