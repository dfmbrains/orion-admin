import {
   Box,
   Button,
   Card,
   Drawer,
   Grid,
   IconButton,
   styled,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import {FlexBox} from 'app/components/FlexBox';
import Apps from 'app/components/icons/Apps';
import Instagram from 'app/components/icons/Instagram';
import LockOutlined from 'app/components/icons/LockOutlined';
import UserOutlined from 'app/components/icons/UserOutlined';
import {H5} from 'app/components/Typography';
import React, {Fragment, useEffect, useState} from 'react';
import BasicInformation from './BasicInformation';
import Password from './Password';
import SocialAccounts from './SocialAccounts';
import {getAllCollection} from "../../firebase/firestoreFirebase";
import {companyFirebasePath} from "../../utils/constant";
import {MatxLoading} from "../../components";

// styled component
const StyledButton = styled(Button)(({theme}) => ({
   borderRadius: 0,
   overflow: 'hidden',
   position: 'relative',
   whiteSpace: 'nowrap',
   textOverflow: 'ellipsis',
   padding: '0.6rem 1.5rem',
   justifyContent: 'flex-start',
   color: theme.palette.text.primary,
}));

const Company = () => {
   const theme = useTheme();
   const [openDrawer, setOpenDrawer] = useState(false);
   const [active, setActive] = useState(1);
   const downMd = useMediaQuery((theme) => theme.breakpoints.down('md'));

   const [companyData, setCompanyData] = useState(null)

   const style = {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.grey[100],

      '&::before': {
         left: 0,
         width: 4,
         content: '""',
         height: '100%',
         position: 'absolute',
         transition: 'all 0.3s',
         backgroundColor: theme.palette.primary.main,
      },
   };

   useEffect(() => {
      getAllCollection(companyFirebasePath)
          .then(res => setCompanyData(res[0]))
   }, [])

   function TabListContent() {
      return (
          <FlexBox flexDirection="column">
             {tabList.map(({id, name, Icon}) => (
                 <StyledButton
                     key={id}
                     startIcon={<Icon sx={{color: 'text.disabled'}}/>}
                     sx={active === id ? style : {'&:hover': style}}
                     onClick={() => {
                        setActive(id);
                        setOpenDrawer(false);
                     }}
                 >
                    {name}
                 </StyledButton>
             ))}
          </FlexBox>
      );
   }

   return (
       <Box p={4}>
          <Grid container spacing={3}>
             <Grid item md={3} xs={12}>
                {downMd ? (
                    <Fragment>
                       <FlexBox alignItems="center" gap={1}>
                          <IconButton sx={{padding: 0}} onClick={() => setOpenDrawer(true)}>
                             <Apps sx={{color: 'primary.main'}}/>
                          </IconButton>

                          <H5>Show More</H5>
                       </FlexBox>

                       <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                          <Box padding={1}>
                             <TabListContent/>
                          </Box>
                       </Drawer>
                    </Fragment>
                ) : (
                    <Card sx={{padding: '1rem 0'}}>
                       <TabListContent/>
                    </Card>
                )}
             </Grid>

             <Grid item md={9} xs={12} sx={{position: "relative"}}>
                {companyData ? (
                    <>
                       {active === tabList[0]?.id &&
                           <BasicInformation setCompanyData={setCompanyData} companyData={companyData}/>}
                       {active === tabList[1]?.id &&
                           <SocialAccounts setCompanyData={setCompanyData} companyData={companyData}/>}
                       {active === tabList[2]?.id && <Password/>}
                    </>
                ) : (
                    <MatxLoading/>
                )}
             </Grid>
          </Grid>
       </Box>
   );
};

const tabList = [
   {id: 1, name: 'Основная информация', Icon: UserOutlined},
   {id: 2, name: 'Социальные сети', Icon: Instagram},
   {id: 3, name: 'Пароль', Icon: LockOutlined}
];

export default Company;
