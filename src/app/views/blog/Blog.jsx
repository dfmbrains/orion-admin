import {styled} from "@mui/material";
import {MatxLoading, MatxSidenavContainer, MatxSidenavContent} from "app/components";
import React, {useEffect, useState} from "react";
import BlogContainer from "./BlogContainer";
import {getAllCollection} from "../../firebase/firestoreFirebase";
import {blogFirebasePath} from "../../utils/constant";
import {getFileFromFirebase} from "../../firebase/fileFirebase";

const ShopRoot = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},
}));

const Shop = () => {
   const [blogList, setBlogList] = useState(null)

   useEffect(() => {
      getAllCollection(blogFirebasePath)
          .then(data => {
             const createdData = data.map(post => {
                return getFileFromFirebase(`${blogFirebasePath}/${post.id}`)
                    .then(images => ({...post, images}))
             })
             return Promise.all(createdData)
          })
          .then(createdData => setBlogList(createdData))
   }, []);

   return (
       blogList
           ? <ShopRoot className="shop">
              <MatxSidenavContainer>
                 <MatxSidenavContent>
                    <BlogContainer blogList={blogList} setBlogList={setBlogList}/>
                 </MatxSidenavContent>
              </MatxSidenavContainer>
           </ShopRoot>
           : <MatxLoading/>
   );
};

export default Shop;
