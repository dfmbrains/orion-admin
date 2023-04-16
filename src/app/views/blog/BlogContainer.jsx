import {Grid, TablePagination} from "@mui/material";
import {Box} from "@mui/system";
import React, {Fragment} from "react";
import ListBlogCard from "./ListBlogCard";

const BlogContainer = ({
                          page,
                          rowsPerPage,
                          productList,
                          setRowsPerPage,
                          handleChangePage,
                       }) => {
   return (
       <Fragment>
          <Box width="100%" height="100%" position="relative">
             <Grid container spacing={2}>
                {productList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) =>
                        <Grid item key={product.id} xs={6}>
                           <ListBlogCard product={product}/>
                        </Grid>
                    )}
             </Grid>
          </Box>

          <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={productList.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[6, 12, 24]}
              onRowsPerPageChange={setRowsPerPage}
              nextIconButtonProps={{"aria-label": "Next Page"}}
              backIconButtonProps={{"aria-label": "Previous Page"}}
          />
       </Fragment>
   );
};

export default BlogContainer;
