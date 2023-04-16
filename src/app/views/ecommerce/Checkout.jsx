import { Box, Button, Card, Checkbox, Divider, Grid, MenuItem, styled } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FlexBetween } from "app/components/FlexBox";
import { H4, H5, Span } from "app/components/Typography";
import React, { Fragment, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useSelector } from "react-redux";
import { countries } from "./Country";
import PaymentDialog from "./PaymentDialog";

const CartRoot = styled(Card)(({ theme }) => ({
  margin: "30px",
  padding: "24px",
  [theme.breakpoints.down("sm")]: { margin: "16px", padding: "16px " },
}));

const Checkout = () => {
  const [state, setState] = useState({});
  const [open, setOpen] = useState(false);
  const { cartList = [] } = useSelector((state) => state.ecommerce);

  const getTotalCost = () => {
    let totalCost = 0;
    cartList.forEach((product) => {
      totalCost += product.amount * product.price;
    });
    return totalCost;
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    console.log(state);
    toggleDialog();
  };

  const toggleDialog = () => setOpen(!open);

  let { firstName, lastName, company, email, mobile, country, city, address } = state;

  return (
    <CartRoot className="checkout">
      <ValidatorForm onSubmit={handleSubmit} onError={(errors) => null}>
        <H4 mb={3}>Billing Details</H4>

        <Grid container spacing={3}>
          <Grid container item spacing={3} lg={8} md={7} xs={12}>
            <Grid item xs={6}>
              <TextValidator
                fullWidth
                type="text"
                name="firstName"
                variant="outlined"
                label="First Name"
                onChange={handleChange}
                value={firstName || ""}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item xs={6}>
              <TextValidator
                fullWidth
                type="text"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={lastName || ""}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                type="text"
                name="company"
                label="Company"
                variant="outlined"
                value={company || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextValidator
                fullWidth
                type="email"
                name="email"
                label="Email"
                variant="outlined"
                value={email || ""}
                onChange={handleChange}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
              />
            </Grid>

            <Grid item xs={6}>
              <TextValidator
                fullWidth
                type="number"
                name="mobile"
                label="Mobile"
                variant="outlined"
                value={mobile || ""}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item xs={6}>
              <TextValidator
                select
                fullWidth
                name="country"
                label="Country"
                variant="outlined"
                value={country || ""}
                onChange={handleChange}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextValidator>
            </Grid>

            <Grid item xs={6}>
              <TextValidator
                fullWidth
                type="text"
                name="city"
                label="City"
                variant="outlined"
                value={city || ""}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                fullWidth
                type="text"
                name="address"
                label="Address"
                variant="outlined"
                value={address || ""}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox />} label="Create an account?" />
            </Grid>
          </Grid>

          <Grid item lg={4} md={5} xs={12}>
            <FlexBetween mb={2}>
              <H5>Porduct</H5>
              <H5>Total Price</H5>
            </FlexBetween>

            <Box>
              {cartList.map((product, ind) => (
                <Fragment key={product.id}>
                  <FlexBetween py={2}>
                    <Span color="text.secondary">{product.title}</Span>
                    <Span color="text.secondary">${product.price * product.amount}</Span>
                  </FlexBetween>

                  {ind !== cartList.length - 1 && <Divider></Divider>}
                </Fragment>
              ))}

              <FlexBetween mt={2} mb={4}>
                <H5>Total</H5>
                <H5>${getTotalCost().toFixed(2)}</H5>
              </FlexBetween>

              <Button fullWidth color="primary" variant="contained" type="submit">
                Place Order
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ValidatorForm>

      <PaymentDialog open={open} toggleDialog={toggleDialog} />
    </CartRoot>
  );
};

export default Checkout;
