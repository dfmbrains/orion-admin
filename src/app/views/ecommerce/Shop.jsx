import { styled } from "@mui/material";
import { MatxSidenav, MatxSidenavContainer, MatxSidenavContent } from "app/components";
import {
  getBrandList,
  getCategoryList,
  getProductList,
  getRatingList,
} from "app/redux/actions/EcommerceActions";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShopContainer from "./ShopContainer";
import ShopSidenav from "./ShopSidenav";

const ShopRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Shop = () => {
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [brands, setBrands] = useState([]);
  const [shipping, setShipping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [orderBy, setOrderBy] = useState("default");
  const [multilevel, setMultilevel] = useState("all");
  const [sliderRange, setSliderRange] = useState([0, 100]);
  const [filteredProductList, setFilteredProductList] = useState([]);

  const dispatch = useDispatch();
  const { productList = [] } = useSelector((state) => state.ecommerce);
  const { categoryList = [] } = useSelector((state) => state.ecommerce);
  const { ratingList = [] } = useSelector((state) => state.ecommerce);
  const { brandList = [] } = useSelector((state) => state.ecommerce);

  const toggleSidenav = () => setOpen(!open);

  const handleSliderChange = (_, newValue) => {
    setSliderRange(newValue);
    filterProductOnPriceRange(newValue[0] * 10, newValue[1] * 10);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const toggleView = (view) => setView(view);

  const handleSearch = (query) => {
    setQuery(query);
    search(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    debounce((query) => {
      let tempList = productList.filter((product) =>
        product.title.toLowerCase().match(query.toLowerCase())
      );

      setFilteredProductList(tempList);
    }, 200),
    [productList]
  );

  const handleMultilevelChange = (event) => {
    let eventValue = event.target.value;
    let range = eventValue.split(",");

    setMultilevel(eventValue);

    if (eventValue === "all") {
      setFilteredProductList(productList);
      return;
    }

    range = range.map((value) => parseInt(value));

    if (range.length === 2) {
      filterProductOnPriceRange(range[0], range[1]);
    } else {
      let tempList = productList.filter((product) => product.price >= range[0]);
      setFilteredProductList(tempList);
    }
  };

  const handleCategoryChange = (event) => {
    let target = event.target;
    let tempCategories = [];
    if (target.checked) {
      tempCategories = [...categories, target.name];
    } else {
      tempCategories = categories.filter((item) => item !== target.name);
    }

    setCategories(tempCategories);
    setFilteredProductList(filterProductOnProperty("category", tempCategories));
  };

  const handleBrandChange = (event) => {
    let target = event.target;
    let tempBrands = [];
    if (target.checked) {
      tempBrands = [...brands, target.name];
    } else {
      tempBrands = brands.filter((item) => item !== target.name);
    }
    setBrands(tempBrands);
    setFilteredProductList(filterProductOnProperty("brand", tempBrands));
  };

  const handleRatingClick = (rate) => {
    setFilteredProductList(filterProductOnProperty("rating", [rate]));
  };

  const handleFreeShippingClick = () => {
    setShipping(!shipping);
    setFilteredProductList(filterProductOnProperty("freeShipping", [shipping]));
  };

  const filterProductOnProperty = (property, value = []) => {
    if (value.length === 0) {
      return productList;
    }
    return productList.filter((product) => value.includes(product[property]));
  };

  const filterProductOnPriceRange = (lowestPrice, highestPrice) => {
    let tempList = productList.filter(
      (product) => product.price >= lowestPrice && product.price <= highestPrice
    );
    setFilteredProductList(tempList);
  };

  const handleClearAllFilter = () => {
    setSliderRange([0, 100]);
    setQuery("");
    setMultilevel("all");
    setShipping(false);
    setCategories([]);
    setBrands([]);
    setFilteredProductList(productList);
  };

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
        <MatxSidenav width="288px" open={open} toggleSidenav={toggleSidenav}>
          <ShopSidenav
            query={query}
            brands={brands}
            shipping={shipping}
            brandList={brandList}
            multilevel={multilevel}
            ratingList={ratingList}
            categories={categories}
            sliderRange={sliderRange}
            categoryList={categoryList}
            handleSearch={handleSearch}
            toggleSidenav={toggleSidenav}
            handleBrandChange={handleBrandChange}
            handleRatingClick={handleRatingClick}
            handleSliderChange={handleSliderChange}
            handleCategoryChange={handleCategoryChange}
            handleClearAllFilter={handleClearAllFilter}
            handleMultilevelChange={handleMultilevelChange}
            handleFreeShippingClick={handleFreeShippingClick}
          />
        </MatxSidenav>

        <MatxSidenavContent>
          <ShopContainer
            view={view}
            page={page}
            orderBy={orderBy}
            toggleView={toggleView}
            rowsPerPage={rowsPerPage}
            toggleSidenav={toggleSidenav}
            productList={filteredProductList}
            handleChangePage={handleChangePage}
            handleChange={(e) => setOrderBy(e.target.value)}
            setRowsPerPage={(e) => setRowsPerPage(e.target.value)}
          />
        </MatxSidenavContent>
      </MatxSidenavContainer>
    </ShopRoot>
  );
};

export default Shop;
