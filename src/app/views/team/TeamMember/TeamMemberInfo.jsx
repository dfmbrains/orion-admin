import {
   Avatar,
   Card,
   Divider,
   styled,
   Table,
   TableBody,
   TableCell,
   TableRow,
} from "@mui/material";
import {FlexBox} from "app/components/FlexBox";
import {H4, Small} from "app/components/Typography";
import React from "react";
import {formatFirebaseTimestamp, formatName} from "../../../utils/utils";

const ContentBox = styled(FlexBox)(() => ({
   alignItems: "center",
   flexDirection: "column",
}));

const StyedSmall = styled(Small)(() => ({
   color: "#08ad6c",
   padding: "2px 4px",
   borderRadius: "4px",
   background: "rgba(9, 182, 109, 0.15)",
}));

const TeamMemberInfo = ({teamMemberData}) => {
   return (
       <Card sx={{pt: 3}} elevation={3}>
          <ContentBox mb={3} alignContent="center">
             <Avatar sx={{width: 84, height: 84}} src={teamMemberData.photo.file}/>
             <H4 sx={{mt: "16px", mb: "8px"}}>
                {formatName(teamMemberData.firstName, teamMemberData.midName, teamMemberData.lastName)}
             </H4>
             <Small color="text.secondary">{teamMemberData.position}</Small>
          </ContentBox>

          <Divider/>

          <Table>
             <TableBody>
                <TableRow>
                   <TableCell sx={{pl: 2}}>Дата рождения</TableCell>
                   <TableCell>{formatFirebaseTimestamp(teamMemberData.birthDate)} </TableCell>
                </TableRow>
                <TableRow>
                   <TableCell sx={{pl: 2}}>Пол</TableCell>
                   <TableCell>{teamMemberData.gender}</TableCell>
                </TableRow>
                <TableRow>
                   <TableCell sx={{pl: 2}}>Период работы</TableCell>
                   <TableCell>{formatFirebaseTimestamp(teamMemberData.workPeriod.from)}{' - '}{teamMemberData.status ?
                       <StyedSmall>по настоящее
                          время</StyedSmall> : formatFirebaseTimestamp(teamMemberData.workPeriod.to)}</TableCell>
                </TableRow>
             </TableBody>
          </Table>
       </Card>
   );
};

export default TeamMemberInfo;
