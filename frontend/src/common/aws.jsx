import axios from "axios";


export const uploadImage = async (img) => {

    let imageUrl = null;

    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url").then(async ({ data: {uploadUrl} }) => {
            console.log("DAta :", uploadUrl);
        await axios({
            method: 'PUT',
            url: uploadUrl,
            headers: { 'Content-Type':'imageFile.type' },
            data: img
        }).then(() => {
            imageUrl = uploadUrl.split('?')[0];     
        }).catch((error)=>{
            console.log("Image uploding error by using Put method",error);
        })
    }).catch((error)=>{
        console.log("image upload failed:",error.message);
    })
    return imageUrl;
}