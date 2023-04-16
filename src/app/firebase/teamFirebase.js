import {firebaseApp} from "../../config";
import {getFirestore, doc, getDoc, getDocs, collection, query, setDoc, updateDoc, deleteDoc} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export const getAllTeamMembers = async () => {
   const q = query(collection(db, "team"));

   const querySnapshot = await getDocs(q);
   const data = []

   querySnapshot.forEach((doc) => {
      data.push(doc.data())
   });
   return data
}

export const getTeamMemberById = async (id) => {
   const docRef = doc(db, "team", id);
   const docSnap = await getDoc(docRef);

   if (docSnap.exists()) {
      return docSnap.data()
   }
}

export const createTeamMember = async (data) => {
   return await setDoc(doc(db, "team", data.id), data);
}

export const updateTeamMemberById = async (data, id) => {
   const ref = doc(db, "team", id);

   return await updateDoc(ref, data);
}

export const deleteTeamMemberById = async (id) => {
   const ref = doc(db, "team", id);

   return await deleteDoc(ref);
}