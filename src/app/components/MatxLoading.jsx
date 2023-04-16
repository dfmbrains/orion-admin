import {CircularProgress} from "@mui/material";
import {Box, styled} from "@mui/system";
import React from "react";
import {FlexAlignCenter} from "./FlexBox";
import OrionLogo from '../assets/logo.png'

const StyledLoading = styled(FlexAlignCenter)(() => ({
   width: "100%",
   height: "100%",

   "& img": {width: "auto", height: "25px"},
   "& .circleProgress": {
      left: -7,
      right: 0,
      position: "absolute",
      top: "calc(50% - 22.5px)",
   },
}));

const Loading = () => {
   return (
       <StyledLoading>
          <Box position="relative">
             <img src={OrionLogo} alt="orion"/>
             <CircularProgress className="circleProgress"/>
          </Box>
       </StyledLoading>
   );
};

export default Loading;
