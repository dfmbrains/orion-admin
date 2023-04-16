import { Button, Dialog, Fab, Icon, IconButton } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Paragraph } from "app/components/Typography";
import { useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const FormController = styled("div")(() => ({
  flexWrap: 1,
  display: "flex",
  marginBottom: "16px",
  justifyContent: "space-between",
}));

const InboxComposeDialog = ({ open, handleClose }) => {
  const [state, setState] = useState({
    to: "",
    subject: "",
    content: "",
    attachment: null,
  });
  const handleSubmit = (event) => {
    // console.log(state);
  };
  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleAttachmentSelection = (event) => {
    setState({
      ...state,
      attachment: event.target.files[0],
    });
  };
  let { to, subject, attachment } = state;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true}>
      <Box p={3}>
        <ValidatorForm onSubmit={handleSubmit} onError={(errors) => null}>
          <TextValidator
            name="to"
            label="To"
            type="email"
            value={to}
            onChange={handleChange}
            sx={{ mb: 2, width: "100%" }}
            validators={["required", "isEmail"]}
            errorMessages={["this field is required", "email is not valid"]}
          />

          <TextValidator
            type="text"
            name="subject"
            label="Subject"
            value={subject}
            onChange={handleChange}
            validators={["required"]}
            sx={{ mb: 2, width: "100%" }}
            errorMessages={["this field is required"]}
          />

          <FormController>
            <Button onClick={handleClose}>Cancel</Button>

            <FlexBox>
              {attachment && <Paragraph sx={{ mr: 3 }}>{attachment.name}</Paragraph>}

              <label htmlFor="attachment">
                <IconButton sx={{ mr: 1 }} component="span">
                  <Icon>attachment</Icon>
                </IconButton>
              </label>

              <input
                type="file"
                id="attachment"
                className="hidden"
                onChange={handleAttachmentSelection}
              />

              <Fab size="medium" color="secondary" type="submit">
                <Icon>send</Icon>
              </Fab>
            </FlexBox>
          </FormController>
        </ValidatorForm>
      </Box>
    </Dialog>
  );
};

export default InboxComposeDialog;
