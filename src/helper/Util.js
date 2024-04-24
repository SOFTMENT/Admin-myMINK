import Compressor from "compressorjs";
const Util = {
    validateEmail:(email)=>{
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    },
     resizeFile : (file,quality=0.6,mode="cover",width=500,height=500) =>{
        return new Promise((resolve,reject)=>{
            new Compressor(file,{
                quality:quality,
                success:(result=>{
                    return resolve(result)
                }),
                error:(error)=>{
                    return reject(error)
                },
                width:width,
                height:height,
                resize:mode,
                
            })
        })
    }
}
export default Util