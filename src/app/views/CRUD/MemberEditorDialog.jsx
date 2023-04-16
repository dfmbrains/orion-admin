import { Box, Button, Dialog, FormControlLabel, Grid, styled, Switch } from "@mui/material";
import { FlexBetween } from "app/components/FlexBox";
import { H4 } from "app/components/Typography";
import { generateRandomId } from "app/utils/utils";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { addNewUser, getUserById, updateUser } from "./TableService";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const MemberEditorDialog = ({ uid, open, handleClose }) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    phone: "",
    balance: "",
    age: "",
    company: "",
    address: "",
    isActive: false,
  });

  const handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      setState({ ...state, isActive: event.target.checked });
      return;
    }

    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = () => {
    let { id } = state;
    if (id) {
      updateUser({ ...state }).then(() => handleClose());
    } else {
      addNewUser({ id: generateRandomId(), ...state }).then(() => handleClose());
    }
  };

  useEffect(() => {
    getUserById(uid).then((data) => setState({ ...data.data }));
  }, [uid]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box p={3}>
        <H4 sx={{ mb: "20px" }}>Update Member</H4>

        <ValidatorForm onSubmit={handleFormSubmit}>
          <Grid sx={{ mb: "16px" }} container spacing={4}>
            <Grid item sm={6} xs={12}>
              <TextField
                type="text"
                name="name"
                label="Name"
                value={state?.name}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextField
                type="text"
                name="email"
                label="Email"
                value={state?.email}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <TextField
                type="text"
                name="phone"
                label="Phone"
                value={state?.phone}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <TextField
                type="number"
                name="balance"
                label="Balance"
                value={state?.balance}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField
                name="age"
                label="Age"
                type="number"
                value={state?.age}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <TextField
                type="text"
                name="company"
                label="Company"
                value={state?.company}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <TextField
                type="text"
                name="address"
                label="Address"
                value={state?.address}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <FormControlLabel
                sx={{ my: "20px" }}
                label="Active Customer"
                control={
                  <Switch
                    checked={state?.isActive}
                    onChange={(event) => handleChange(event, "switch")}
                  />
                }
              />
            </Grid>
          </Grid>

          <FlexBetween>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>

            <Button variant="outlined" color="secondary" onClick={() => handleClose()}>
              Cancel
            </Button>
          </FlexBetween>
        </ValidatorForm>
      </Box>
    </Dialog>
  );
};

export default MemberEditorDialog;
