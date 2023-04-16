import { Box, Card } from "@mui/material";
import { styled } from "@mui/system";
import { Breadcrumb } from "app/components";
import React, { Component } from "react";
import SimpleForm from "../material-kit/forms/SimpleForm";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

class BasicForm extends Component {
  render() {
    return (
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb routeSegments={[{ name: "Forms", path: "/forms" }, { name: "Basic" }]} />
        </Box>

        <Card sx={{ px: 3, pt: 1, pb: 2 }}>
          <SimpleForm />
        </Card>
      </Container>
    );
  }
}

export default BasicForm;
