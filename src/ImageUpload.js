import React, { useState } from "react";
import {Button} from "@material-ui/core";
import {storage, db} from "./firebase";
import firebase from "firebase"; 
import "./ImageUpload.css";



function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (event)=>{
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }

    const handleUpload = ()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        //acess to storage in fb, creating a new folder images/${image.name}, then you get ref
        //of that point, then you put the image in; imag.name is file name we uploaded. 
        uploadTask.on(
            "state_changed", 
            (snapshot) => {
                //keep giving me the snapshots of the progress
                //progress function ... 
                const progress = Math.round(
                   ( snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                
                setProgress(progress);
                //for the visual progress bar
            },

            (error) => {
                //Error function...
                console.log(error);
                alert(error.messge);
            },

            ()=>{
                //complete function...
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        //timestamp is based on the server where the coding is living. -> one unified time;
                        caption:caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
 
                })
            }
        )
         
 
    }
    return (
        <div className="imageupload">
            <progress className="imageupload_progress"  value={progress}   max= "100"/>
            <input  type="text"
                    className="imageupload_caption"
                    placeholder="Enter a caption"
                    onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button className="imageupload_button"  onClick={handleUpload}> Upload </Button>

        </div>
    )


}


export default ImageUpload;