import {
  Avatar,
  Box,
  Button,
  Card,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { FlexBetween, FlexBox } from "app/components/FlexBox";
import { H5, Paragraph } from "app/components/Typography";
import { deleteProductFromCart, updateCartAmount } from "app/redux/actions/EcommerceActions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CartRoot = styled(Card)(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Cart = () => {
  const { cartList = [] } = useSelector((state) => state.ecommerce);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotalCost = () => {
    let totalCost = 0;
    cartList.forEach((product) => {
      totalCost += product.amount * product.price;
    });
    return totalCost;
  };

  const handleChange = (event, productId) => {
    let amount = event.target.value;
    dispatch(updateCartAmount(user.userId, productId, Math.abs(amount)));
  };

  const handleDeleteFromCart = (productId) => {
    dispatch(deleteProductFromCart(user.userId, productId));
  };

  return (
    <CartRoot elevation={3}>
      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} sx={{ pl: 3 }}>
                Name
              </TableCell>

              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cartList.map((product) => (
              <TableRow key={product.id}>
                <TableCell colSpan={3} sx={{ pl: 3 }}>
                  <FlexBox gap={2}>
                    <Avatar
                      src={product.imgUrl}
                      alt={product.title}
                      sx={{ borderRadius: 2, width: 80, height: 80 }}
                    />
                    <Box>
                      <H5>{product.title}</H5>
                      <Paragraph color="text.secondary">
                        {product.description.substring(0, 140)}...
                      </Paragraph>
                    </Box>
                  </FlexBox>
                </TableCell>

                <TableCell align="center">
                  <H5>${product.price}</H5>
                </TableCell>

                <TableCell align="center">
                  <TextField
                    size="small"
                    name="amount"
                    type="number"
                    variant="outlined"
                    value={product.amount}
                    inputProps={{ style: { width: "60px" } }}
                    onChange={(e) => handleChange(e, product.id)}
                  />
                </TableCell>

                <TableCell align="center">
                  <H5>${product.price * product.amount}</H5>
                </TableCell>

                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleDeleteFromCart(product.id)}>
                    <Icon fontSize="small">clear</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FlexBetween p={3}>
        <Box gap={2} display="flex" alignItems="center">
          <TextField size="small" variant="outlined" placeholder="Discount Coupon" />

          <Button variant="contained" color="secondary">
            Apply
          </Button>

          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate("/ecommerce/checkout")}
          >
            Checkout
          </Button>
        </Box>

        <FlexBetween flexShrink={0} flexBasis={400}>
          <H5>Total</H5>
          <H5>${getTotalCost().toFixed(2)}</H5>
        </FlexBetween>
      </FlexBetween>
    </CartRoot>
  );
};

export default Cart;
