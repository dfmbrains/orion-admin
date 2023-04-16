import { Delete } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker2 from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Box, Button, Dialog, Grid, Icon, IconButton, styled, TextField } from "@mui/material";
import { FlexBetween } from "app/components/FlexBox";
import { useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { H4 } from "../../components/Typography";
import { addNewEvent, deleteEvent, updateEvent } from "./CalendarService";

const DialogHeader = styled(FlexBetween)(({ theme }) => ({
  padding: "10px 15px",
  background: theme.palette.primary.main,
}));

const EventEditorDialog = ({ event = {}, open, handleClose }) => {
  const [state, setState] = useState(event);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = () => {
    let { id } = state;
    if (id) {
      updateEvent({ ...state }).then(() => handleClose());
    } else {
      addNewEvent({ id: generateRandomId(), ...state }).then(() => handleClose());
    }
  };

  const handleDeleteEvent = () => {
    if (state.id) {
      deleteEvent(state).then(() => handleClose());
    }
  };

  const handleDateChange = (date, name) => {
    setState({ ...state, [name]: date });
  };

  const generateRandomId = () => {
    let tempId = Math.random().toString();
    let id = tempId.substring(2, tempId.length - 1);
    return id;
  };

  let { title, location, note } = state;

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth={true}>
      <DialogHeader>
        <H4 sx={{ m: 0, color: "#fff" }}>Add Events</H4>

        <IconButton onClick={handleClose}>
          <Icon sx={{ color: "#fff" }}>clear</Icon>
        </IconButton>
      </DialogHeader>

      <Box p={2}>
        <ValidatorForm onSubmit={handleFormSubmit}>
          <TextValidator
            label="Title"
            type="text"
            name="title"
            value={title || ""}
            onChange={handleChange}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />

          <Grid container spacing={4}>
            <Grid item sm={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker2
                  value={new Date()}
                  onChange={(date) => handleDateChange(date, "start")}
                  renderInput={(props) => (
                    <TextField {...props} label="Start date" variant="standard" />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sm={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker2
                  value={new Date()}
                  onChange={(date) => handleDateChange(date, "end")}
                  renderInput={(props) => (
                    <TextField {...props} label="End date" variant="standard" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Box py={1.3} />

          <TextValidator
            type="text"
            name="location"
            label="Location"
            value={location || ""}
            onChange={handleChange}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />

          <TextValidator
            rows={2}
            type="text"
            name="note"
            label="Note"
            multiline={true}
            value={note || ""}
            onChange={handleChange}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />

          <FlexBetween>
            <Button variant="contained" color="primary">
              Save
            </Button>

            <Button startIcon={<Delete />} onClick={handleDeleteEvent}>
              Delete
            </Button>
          </FlexBetween>
        </ValidatorForm>
      </Box>
    </Dialog>
  );
};

export default EventEditorDialog;
