import {firebaseApp} from "../../config";
import {getFirestore, doc, getDoc, getDocs, collection, query, setDoc, updateDoc, deleteDoc} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export const getAllCollection = async (path) => {
   const q = query(collection(db, path));

   const querySnapshot = await getDocs(q);
   const data = []

   querySnapshot.forEach((doc) => {
      data.push(doc.data())
   });
   return data
}

export const getCollectionDocumentById = async (path, id) => {
   const docRef = doc(db, path, id);
   const docSnap = await getDoc(docRef);

   if (docSnap.exists()) {
      return docSnap.data()
   }
}

export const createCollectionDocument = async (path, data) => {
   return await setDoc(doc(db, path, data.id), data);
}

export const updateCollectionDocumentById = async (path, data, id) => {
   const ref = doc(db, path, id);

   return await updateDoc(ref, data);
}

export const deleteCollectionDocumentById = async (path, id) => {
   const ref = doc(db, path, id);

   return await deleteDoc(ref);
}