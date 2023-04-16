import {Fade, Grid} from "@mui/material";
import React from "react";
import TeamMemberActions from "./TeamMemberActions";
import TeamMemberInfo from "./TeamMemberInfo";
import TeamMemberContacts from "./TeamMemberContacts";

const TeamMemberDetails = ({teamMemberData}) => {
   return (
       <Fade in timeout={300}>
          <Grid container spacing={3}>
             <Grid item md={6} xs={12}>
                <TeamMemberInfo teamMemberData={teamMemberData}/>
             </Grid>

             <Grid item md={6} xs={12}>
                <TeamMemberContacts teamMemberData={teamMemberData}/>
                <TeamMemberActions teamMemberData={teamMemberData}/>
             </Grid>
          </Grid>
       </Fade>
   );
};

export default TeamMemberDetails;
