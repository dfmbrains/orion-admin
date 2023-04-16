import {Card, Divider, Table, TableBody, TableCell, TableRow} from "@mui/material";
import {H4} from "app/components/Typography";
import React from "react";

const TeamMemberContacts = ({teamMemberData}) => {
   const {contacts} = teamMemberData

   return (
       <Card elevation={3}>
          <H4 sx={{p: 2}}>Контакты</H4>
          <Divider/>

          <Table>
             <TableBody>
                <TableRow>
                   <TableCell sx={{pl: 2}}>Номер телефона</TableCell>
                   <TableCell>{contacts.phoneNumber}</TableCell>
                </TableRow>
                <TableRow>
                   <TableCell sx={{pl: 2}}>Электронная почта</TableCell>
                   <TableCell>{contacts.email}</TableCell>
                </TableRow>
                <TableRow>
                   <TableCell sx={{pl: 2}}>Адрес проживания</TableCell>
                   <TableCell>{contacts.address}</TableCell>
                </TableRow>
             </TableBody>
          </Table>
       </Card>
   );
};

export default TeamMemberContacts;
