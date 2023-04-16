import {Box, styled} from "@mui/material";

const FlexBox = styled(Box)(() => ({display: "flex"}));

const FlexBetween = styled(Box)(() => ({
   display: "flex",
   alignItems: "center",
   justifyContent: "space-between",
}));

const FlexGap10 = styled(Box)(() => ({
   display: "flex",
   alignItems: "center",
   columnGap: "10px"
}));

const FlexAlignCenter = styled(Box)(() => ({
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
}));

const FlexJustifyCenter = styled(Box)(() => ({
   display: "flex",
   justifyContent: "center",
}));

export {FlexBox, FlexBetween, FlexAlignCenter, FlexJustifyCenter, FlexGap10};
