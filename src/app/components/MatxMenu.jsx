import { Menu } from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { Fragment, useState } from "react";

const MenuButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  color: theme.palette.text.primary,
  "& div:hover": { backgroundColor: theme.palette.action.hover },
}));

const MatxMenu = ({ horizontalPosition = "left", children, menuButton }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  return (
    <Fragment>
      <MenuButton onClick={handleClick}>{menuButton}</MenuButton>

      <Menu
        elevation={8}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: horizontalPosition }}
        transformOrigin={{ vertical: "top", horizontal: horizontalPosition }}
      >
         <Box onClick={handleClose}>
            {children}
         </Box>
      </Menu>
    </Fragment>
  );
};

export default MatxMenu;
