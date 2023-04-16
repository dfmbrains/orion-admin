import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { FlexBetween, FlexBox } from "app/components/FlexBox";
import { H5, Paragraph } from "app/components/Typography";
import React, { useCallback, useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useParams } from "react-router-dom";
import { addInvoice, getInvoiceById, updateInvoice } from "./InvoiceService";
import { StyledTable } from "./InvoiceViewer";

const StyledH5 = styled("h5")(() => ({ fontSize: 15 }));

const FlexEndBox = styled(FlexBox)(() => ({ justifyContent: "flex-end" }));

const FormBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  "& .label": { height: 32 },
}));

const InvoiceEditor = ({ isNewInvoice, toggleInvoiceEditor }) => {
  const [isAlive, setIsAlive] = useState(true);
  const [state, setState] = useState(initialValues);
  const navigate = useNavigate();
  const { id } = useParams();

  const generateRandomId = useCallback(() => {
    let tempId = Math.random().toString();
    let id = tempId.substr(2, tempId.length - 1);
    setState((state) => ({ ...state, id }));
  }, []);

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSellerBuyerChange = (event, fieldName) => {
    event.persist();
    setState({
      ...state,
      [fieldName]: {
        ...state[fieldName],
        [event.target.name]: event.target.value,
      },
    });
  };

  const handleIvoiceListChange = (event, index) => {
    let tempItemList = [...state.item];
    tempItemList.map((element, i) => {
      if (index === i) element[event.target.name] = event.target.value;
      return element;
    });

    setState({ ...state, item: tempItemList });
  };

  const addItemToInvoiceList = () => {
    let tempItemList = [...state.item];
    tempItemList.push({ name: "", unit: "", price: "" });
    setState({ ...state, item: tempItemList });
  };

  const deleteItemFromInvoiceList = (index) => {
    let tempItemList = [...state.item];
    tempItemList.splice(index, 1);

    setState({ ...state, item: tempItemList });
  };

  const handleDateChange = (date) => setState({ ...state, date });

  const handleSubmit = () => {
    setState({ ...state, loading: true });
    let tempState = { ...state };
    delete tempState.loading;
    if (isNewInvoice)
      addInvoice(tempState).then(() => {
        setState({ ...state, loading: false });
        navigate(`/invoice/${state.id}`);
        toggleInvoiceEditor();
      });
    else
      updateInvoice(tempState).then(() => {
        setState({ ...state, loading: false });
        toggleInvoiceEditor();
      });
  };

  useEffect(() => {
    if (!isNewInvoice) {
      getInvoiceById(id).then(({ data }) => {
        if (isAlive) setState({ ...data });
      });
    } else {
      generateRandomId();
    }
  }, [id, isNewInvoice, isAlive, generateRandomId]);

  useEffect(() => {
    return () => setIsAlive(false);
  }, []);

  let subTotalCost = 0;
  let {
    vat,
    buyer,
    seller,
    status,
    orderNo,
    loading,
    currency,
    item: invoiceItemList = [],
  } = state;

  return (
    <Box py={2} className="invoice-viewer">
      <ValidatorForm onSubmit={handleSubmit} onError={(errors) => null}>
        <FlexEndBox mb={3} px={2} gap={2} className="viewer_actions">
          <Button type="button" variant="text" onClick={() => toggleInvoiceEditor()}>
            Cancel
          </Button>

          <Button type="submit" color="primary" variant="contained" disabled={loading}>
            Save
          </Button>
        </FlexEndBox>

        <FormBox px={2} mb={2} className="viewer__order-info">
          <Box>
            <StyledH5 sx={{ mb: 1 }}>Order Info</StyledH5>
            <Paragraph sx={{ mb: 2 }}>Order Number</Paragraph>
            <TextValidator
              fullWidth
              type="text"
              name="orderNo"
              value={orderNo}
              label="Order No."
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
          </Box>

          <Box>
            <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
              <RadioGroup aria-label="status" name="status" value={status} onChange={handleChange}>
                <FormControlLabel
                  value="pending"
                  label="Pending"
                  className="label"
                  labelPlacement="start"
                  control={<Radio color="secondary" />}
                />

                <FormControlLabel
                  className="label"
                  value="processing"
                  label="Processing"
                  labelPlacement="start"
                  control={<Radio color="secondary" />}
                />

                <FormControlLabel
                  className="label"
                  value="delivered"
                  label="Delivered"
                  labelPlacement="start"
                  control={<Radio color="secondary" />}
                />
              </RadioGroup>
            </FormControl>

            <Box textAlign="right">
              <StyledH5 sx={{ fontWeight: "500" }}>
                <strong>Order date: </strong>
              </StyledH5>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={new Date()}
                onChange={handleDateChange}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    variant="standard"
                    label="Order Date"
                    id="mui-pickers-date"
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </FormBox>

        <Divider />

        <FlexBetween flexWrap="nowrap" gap={2} px={2} mb={2}>
          <Box maxWidth={400} width="100%">
            <StyledH5 sx={{ mb: "20px" }}>Bill From</StyledH5>
            <TextValidator
              fullWidth
              name="name"
              type="text"
              sx={{ mb: "20px" }}
              label="Seller Name"
              validators={["required"]}
              value={seller ? seller.name : null}
              errorMessages={["this field is required"]}
              onChange={(event) => handleSellerBuyerChange(event, "seller")}
            />
            <TextValidator
              rows={4}
              fullWidth
              type="text"
              name="address"
              multiline={true}
              label="Seller Name"
              validators={["required"]}
              value={seller ? seller.address : null}
              errorMessages={["this field is required"]}
              onChange={(event) => handleSellerBuyerChange(event, "seller")}
            />
          </Box>

          <Box maxWidth={400} width="100%">
            <StyledH5 sx={{ mb: "20px" }}>Bill To</StyledH5>
            <TextValidator
              fullWidth
              type="text"
              name="name"
              label="Buyer Name"
              sx={{ mb: "20px" }}
              validators={["required"]}
              value={buyer ? buyer.name : null}
              errorMessages={["this field is required"]}
              onChange={(event) => handleSellerBuyerChange(event, "buyer")}
            />
            <TextValidator
              rows={4}
              fullWidth
              type="text"
              name="address"
              multiline={true}
              label="Buyer Address"
              validators={["required"]}
              value={buyer ? buyer.address : null}
              errorMessages={["this field is required"]}
              onChange={(event) => handleSellerBuyerChange(event, "buyer")}
            />
          </Box>
        </FlexBetween>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell align="center">Unit Price</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Cost</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoiceItemList.map((item, index) => {
              subTotalCost += item.price * item.unit;
              return (
                <TableRow key={index}>
                  <TableCell align="left">{index + 1}</TableCell>

                  <TableCell align="left">
                    <TextValidator
                      fullWidth
                      type="text"
                      name="name"
                      size="small"
                      label="Item Name"
                      validators={["required"]}
                      value={item ? item.name : null}
                      errorMessages={["this field is required"]}
                      onChange={(event) => handleIvoiceListChange(event, index)}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <TextValidator
                      fullWidth
                      name="price"
                      size="small"
                      type="number"
                      label="Item Price"
                      validators={["required"]}
                      value={item ? item.price : null}
                      errorMessages={["this field is required"]}
                      onChange={(event) => handleIvoiceListChange(event, index)}
                      style={{ maxWidth: 100 }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <TextValidator
                      fullWidth
                      name="unit"
                      size="small"
                      type="number"
                      label="Item Unit"
                      validators={["required"]}
                      value={item ? item.unit : null}
                      errorMessages={["this field is required"]}
                      onChange={(event) => handleIvoiceListChange(event, index)}
                      style={{ maxWidth: 100 }}
                    />
                  </TableCell>

                  <TableCell align="center">{item.unit * item.price}</TableCell>

                  <TableCell align="center">
                    <Button onClick={() => deleteItemFromInvoiceList(index)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>

        <FlexEndBox p={2}>
          <Button variant="contained" onClick={addItemToInvoiceList}>
            Add Item
          </Button>
        </FlexEndBox>

        {/* total cost calculation */}
        <Box px={2} py={1} maxWidth={300} marginLeft="auto">
          <FlexBetween mb={2}>
            <Paragraph>Sub Total:</Paragraph>
            <Paragraph>{subTotalCost}</Paragraph>
          </FlexBetween>

          <FlexBetween mb={2}>
            <Paragraph flexGrow={1}>Vat(%):</Paragraph>
            <TextValidator
              name="vat"
              label="Vat"
              value={vat}
              size="small"
              type="number"
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
              style={{ maxWidth: 100 }}
            />
          </FlexBetween>

          <FlexBetween mb={2}>
            <Paragraph flexGrow={1}>currency:</Paragraph>
            <TextValidator
              type="text"
              size="small"
              name="currency"
              label="Currency"
              value={currency}
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
              style={{ maxWidth: 100 }}
            />
          </FlexBetween>

          <FlexBetween>
            <H5>Grand Total:</H5>
            <H5>${subTotalCost + (subTotalCost * vat) / 100}</H5>
          </FlexBetween>
        </Box>
      </ValidatorForm>
    </Box>
  );
};

const initialValues = {
  id: "",
  orderNo: "",
  buyer: {
    name: "",
    address: "",
  },
  seller: {
    name: "",
    address: "",
  },
  item: [],
  status: "",
  vat: "",
  date: new Date(),
  currency: "",
  loading: false,
};

export default InvoiceEditor;
