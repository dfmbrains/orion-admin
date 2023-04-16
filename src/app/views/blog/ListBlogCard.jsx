import Rating from "@mui/lab/Rating";
import { Button, Card, Grid, Icon, styled, useTheme } from "@mui/material";
import { AddToCartButton } from "app/components";
import { FlexAlignCenter, FlexBetween } from "app/components/FlexBox";
import { H3, H5, Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { addProductToCart, updateCartAmount } from "app/redux/actions/EcommerceActions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = styled(Card)(() => ({
  padding: 16,
  position: "relative",
  height: "100% !important",
  "&:hover": { "& .image-box-overlay": { opacity: 1 } },
}));

const IMG = styled("img")(() => ({ width: "100%" }));

const ImageBox = styled(FlexAlignCenter)(() => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2,
  opacity: 0,
  position: "absolute",
  background: "rgba(0, 0, 0, 0.74)",
  transition: "all 250ms ease-in-out",
}));

const ListBlogCard = ({ product }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { cartList } = useSelector((state) => state.ecommerce);

  const amount = cartList?.find((p) => p.id === product.id)?.amount || 0;
  const handleUpdateCart = (productAmount) => {
    dispatch(updateCartAmount(user.id, product.id, productAmount));
  };
  const handleAddProduct = () => {
    dispatch(addProductToCart(user.id, product.id));
  };

  return (
    <ProductCard elevation={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <FlexAlignCenter position="relative">
            <IMG src={product.imgUrl} alt={product.title} />

            <ImageBox>
              <Button
                variant="outlined"
                sx={{ background: theme.palette.background.default }}
                onClick={() => handleAddProduct(user.id, product.id)}
              >
                <Icon sx={{ mr: 2 }}>shopping_cart</Icon>
                <span>Add to cart</span>
              </Button>
            </ImageBox>
          </FlexAlignCenter>
        </Grid>

        <Grid item sm={6} xs={12} sx={{ p: "12px" }}>
          <H3>{product.title}</H3>

          <FlexBetween mb={2}>
            <H5 sx={{ color: theme.palette.text.secondary }}>${product.price.toFixed(2)}</H5>
            <Rating
              size="small"
              readOnly={true}
              precision={0.5}
              name="half-rating"
              value={product.rating}
            />
          </FlexBetween>

          <Paragraph sx={{ mb: 4, color: theme.palette.text.secondary }}>
            {product.description.substring(0, 200)}
          </Paragraph>

          <AddToCartButton
            amount={amount}
            totalUnit={product.totalUnit}
            handleAddProduct={handleAddProduct}
            handleUpdateCart={handleUpdateCart}
          />
        </Grid>
      </Grid>
    </ProductCard>
  );
};

export default ListBlogCard;
