import { Clear, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Badge, Box, Button, Drawer, Icon, IconButton, styled, ThemeProvider } from "@mui/material";
import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import {
  deleteProductFromCart,
  getCartList,
  updateCartAmount,
} from "app/redux/actions/EcommerceActions";
import { sideNavWidth, topBarHeight } from "app/utils/constant";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { themeShadows } from "./MatxTheme/themeColors";
import { H6, Small } from "./Typography";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "& span": { color: theme.palette.text.primary },
  "& #disable": { color: theme.palette.text.disabled },
}));

const MiniCart = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  width: sideNavWidth,
  flexDirection: "column",
}));

const CartBox = styled(Box)(() => ({
  padding: "4px",
  display: "flex",
  paddingLeft: "16px",
  alignItems: "center",
  height: topBarHeight,
  boxShadow: themeShadows[6],
  "& h5": {
    marginTop: 0,
    marginBottom: 0,
    fontWeight: "500",
    marginLeft: "16px",
  },
}));

const ProductBox = styled(Box)(() => ({
  gap: 5,
  display: "flex",
  padding: "8px 8px",
  alignItems: "center",
  transition: "background 300ms ease",
  "&:hover": { background: "rgba(0,0,0,0.01)" },
}));

const ProductDetails = styled(Box)(() => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  "& h6": {
    width: 120,
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

let cartListLoaded = false;

function ShoppingCart({ container }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [panelOpen, setPanelOpen] = useState(false);
  const { cartList } = useSelector((state) => state.ecommerce);

  if (!cartListLoaded) {
    dispatch(getCartList(user.id));
    cartListLoaded = true;
  }

  const handleDrawerToggle = () => setPanelOpen(!panelOpen);

  const handleCheckoutClick = () => {
    setPanelOpen(false);
    navigate("/ecommerce/checkout");
  };

  // total cartlist items amount
  const totalAmount = cartList.reduce((prev, curr) => prev + curr.price * curr.amount, 0);

  // remove product from cart handler
  const handleRemoveItem = (product) => () => {
    dispatch(deleteProductFromCart(user.userId, product.id));
  };

  // remove quantity from a product
  const handleQuantityDecrement = (product) => () => {
    dispatch(updateCartAmount(user.id, product.id, product.amount - 1));
  };

  // add quantity from a product
  const handleQuantityIncrement = (product) => () => {
    dispatch(updateCartAmount(user.id, product.id, product.amount + 1));
  };

  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle}>
        <Badge color="secondary" badgeContent={cartList.length}>
          <Icon sx={{ color: "text.primary" }}>shopping_cart</Icon>
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          anchor={"right"}
          open={panelOpen}
          variant="temporary"
          container={container}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          <MiniCart>
            <CartBox>
              <Icon color="primary">shopping_cart</Icon>
              <h5>Cart</h5>
            </CartBox>

            <Box flexGrow={1} overflow="auto">
              {cartList.map((product) => (
                <ProductBox key={product.id}>
                  <Box display="flex" flexDirection="column">
                    <StyledIconButton size="small" onClick={handleQuantityIncrement(product)}>
                      <KeyboardArrowUp sx={{ fontSize: 18 }} />
                    </StyledIconButton>

                    <StyledIconButton
                      size="small"
                      disabled={product.amount < 2}
                      onClick={handleQuantityDecrement(product)}
                    >
                      <KeyboardArrowDown sx={{ fontSize: 18 }} />
                    </StyledIconButton>
                  </Box>

                  <img src={product.imgUrl} alt={product.title} width="50" />

                  <ProductDetails>
                    <H6>{product.title}</H6>

                    <Small color="text.secondary">
                      ${product.price} x {product.amount}
                    </Small>
                  </ProductDetails>

                  <StyledIconButton size="small" onClick={handleRemoveItem(product)}>
                    <Clear sx={{ fontSize: 16 }} />
                  </StyledIconButton>
                </ProductBox>
              ))}
            </Box>

            <Button
              color="primary"
              variant="contained"
              onClick={handleCheckoutClick}
              disabled={cartList.length === 0}
              sx={{ width: "100%", borderRadius: 0 }}
            >
              Checkout (${totalAmount.toFixed(2)})
            </Button>
          </MiniCart>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
}

export default ShoppingCart;
