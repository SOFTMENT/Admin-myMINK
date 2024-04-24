import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../config/firebase-config"

export const uploadImage = (image,path)=>{
   
    return new Promise(async(resolve,reject)=>{
     const storageRef = ref(storage,path)
     try {
         await uploadBytes(storageRef,image)
         const downloadLink = await getDownloadURL(storageRef)
         return resolve(downloadLink)
     } catch (error) {
         reject(error)
     }
    })
 
}