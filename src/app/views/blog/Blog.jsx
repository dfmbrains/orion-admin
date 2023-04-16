import {styled} from "@mui/material";
import {MatxSidenavContainer, MatxSidenavContent} from "app/components";
import {
   getBrandList,
   getCategoryList,
   getProductList,
   getRatingList,
} from "app/redux/actions/EcommerceActions";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import BlogContainer from "./BlogContainer";

const ShopRoot = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},
}));

const Shop = () => {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(6);
   const [filteredProductList, setFilteredProductList] = useState([]);

   const dispatch = useDispatch();
   const {productList = []} = useSelector((state) => state.ecommerce);

   const handleChangePage = (_, newPage) => setPage(newPage);

   useEffect(() => {
      dispatch(getProductList());
      dispatch(getCategoryList());
      dispatch(getRatingList());
      dispatch(getBrandList());
   }, [dispatch]);

   useEffect(() => {
      setFilteredProductList(productList);
   }, [productList]);

   return (
       <ShopRoot className="shop">
          <MatxSidenavContainer>

             <MatxSidenavContent>
                <BlogContainer
                    page={page}
                    rowsPerPage={rowsPerPage}
                    productList={filteredProductList}
                    handleChangePage={handleChangePage}
                    setRowsPerPage={(e) => setRowsPerPage(e.target.value)}
                />
             </MatxSidenavContent>
          </MatxSidenavContainer>
       </ShopRoot>
   );
};

export default Shop;
