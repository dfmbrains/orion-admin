import {getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject} from "firebase/storage";

const storage = getStorage();

export const getFileFromFirebase = async (path) => {
   const listRef = ref(storage, path);
   return listAll(listRef)
       .then((res) => {
          const promises = res.items.map((itemRef) => {
             return getDownloadURL(itemRef)
                 .then((url) => {
                    return new Promise((resolve, reject) => {
                       const xhr = new XMLHttpRequest();
                       xhr.responseType = 'blob';
                       xhr.onload = () => {
                          const blob = xhr.response;
                          const reader = new FileReader();
                          reader.readAsDataURL(blob);
                          reader.onload = () => {
                             resolve({file: reader.result, name: itemRef.name});
                          };
                       };
                       xhr.onerror = (error) => {
                          reject(error);
                       };
                       xhr.open('GET', url);
                       xhr.send();
                    });
                 });
          });
          return Promise.all(promises);
       })
       .catch((error) => console.log(error));
}

export const uploadFileToFirebase = async (fileData, path) => {
   const storageRef = ref(storage, path);
   const metadata = {contentType: fileData?.type || ''};

   return await uploadBytes(storageRef, fileData, metadata)
}

export const deleteFileFromFirebase = (path) => {
   const fileRef = ref(storage, path);

   deleteObject(fileRef)
       .then(() => {
          console.log("File deleted successfully");
       })
       .catch((error) => {
          console.error("Error deleting file: ", error);
       });
}