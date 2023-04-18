import {Button, styled} from "@mui/material";
import {Breadcrumb, MatxLoading, MatxSidenavContainer, MatxSidenavContent} from "app/components";
import React, {useEffect, useState} from "react";
import BlogContainer from "./BlogContainer";
import {getAllCollection} from "../../firebase/firestoreFirebase";
import {blogFirebasePath} from "../../utils/constant";
import {getFileFromFirebase} from "../../firebase/fileFirebase";
import {useNavigate} from "react-router-dom";

const ShopRoot = styled("div")(({theme}) => ({
   margin: "30px",
   [theme.breakpoints.down("sm")]: {margin: "16px"},

   "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: {marginBottom: "16px"},
   }
}));

const Shop = () => {
   const navigate = useNavigate()

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
                    <div className="breadcrumb">
                       <Breadcrumb routeSegments={[{name: "Список публикаций"}]}/>
                    </div>

                    <Button sx={{mb: 2}} color="primary" variant="contained" onClick={() => navigate('create')}>Добавить
                       публикацию</Button>

                    <BlogContainer blogList={blogList} setBlogList={setBlogList}/>
                 </MatxSidenavContent>
              </MatxSidenavContainer>
           </ShopRoot>
           : <MatxLoading/>
   );
};

export default Shop;
