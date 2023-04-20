import {Avatar, Box, Button, Card, Divider, TextField} from "@mui/material";
import {FlexBetween, FlexBox, FlexGap10} from "app/components/FlexBox";
import {H5, H6, Paragraph} from "app/components/Typography";
import {useState} from "react";
import {updateCollectionDocumentById} from "../../firebase/firestoreFirebase";
import {companyFirebasePath} from "../../utils/constant";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";

const SocialAccounts = ({companyData, setCompanyData}) => {
   const {socialMedia} = companyData

   const {enqueueSnackbar} = useSnackbar();

   const [isEditing, setIsEditing] = useState(null)
   const [loading, setLoading] = useState(false)

   const onSubmit = async (key) => {
      setLoading(true)

      const createdData = {
         ...companyData,
         socialMedia: {...socialMedia, [key]: {...socialMedia[key], link: isEditing.link}}
      }

      try {
         await updateCollectionDocumentById(companyFirebasePath, createdData, companyData.id)

         enqueueSnackbar("Успешно отредактировано", {variant: "success"})
         setCompanyData(createdData)
         setIsEditing(null)
      } catch (e) {
         enqueueSnackbar("Произошла ошибка", {variant: "error"})
      }
      setLoading(false)
   }

   return (
       <Card sx={{pb: 2}}>
          <FlexBetween px={3}>
             <H5 py={3}>Аккаунты в социальных сетях</H5>
             {isEditing && (
                 <Button onClick={() => setIsEditing(null)} size={"small"} color={"error"}
                         variant={"outlined"}>Отменить</Button>
             )}
          </FlexBetween>
          <Divider/>

          {accountList.map((item) => (
              <FlexBetween
                  key={item.id}
                  sx={{
                     borderBottom: 1,
                     padding: "1rem 1.5rem",
                     borderColor: "grey.100",
                     "&:last-of-type": {borderBottom: 0},
                  }}
              >
                 <FlexBox alignItems="center" gap={1}>
                    <Avatar src={item.image} sx={{width: 30, height: 30}}/>

                    <Box>
                       <H6>{item.title}</H6>
                       <Paragraph>{socialMedia[item.title.toLowerCase()].link}</Paragraph>
                    </Box>
                 </FlexBox>

                 {isEditing && isEditing.id === item.id
                     ? <FlexGap10>
                        <TextField
                            size={"small"}
                            type="text"
                            name="name"
                            label={`Ссылка на ${item.title.toLowerCase()}`}
                            value={isEditing.link}
                            onChange={(e) => setIsEditing((prevState) => ({...prevState, link: e.target.value}))}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                        />
                        <LoadingButton loading={loading} onClick={() => onSubmit(item.title.toLowerCase())}
                                       variant={"contained"} type={"button"} color={"success"}>Сохранить</LoadingButton>
                     </FlexGap10>
                     : <Button variant={"outlined"} type={"button"} onClick={() => setIsEditing({
                        id: item.id,
                        link: socialMedia[item.title.toLowerCase()].link
                     })}>Редактировать</Button>
                 }
              </FlexBetween>
          ))}
       </Card>
   );
};

const accountList = [
   {
      id: 1,
      title: "Instagram",
      image: "/assets/images/social-media/instagram.svg"
   },
   {
      id: 2,
      title: "Facebook",
      image: "/assets/images/social-media/facebook.svg"
   },
   {
      id: 3,
      title: "Skype",
      image: "/assets/images/social-media/skype.svg"
   },
   {
      id: 4,
      title: "Telegram",
      image: "/assets/images/social-media/telegram.png"
   },
   {
      id: 5,
      title: "WhatsApp",
      image: "/assets/images/social-media/whatsapp.png"
   },
];

export default SocialAccounts;
