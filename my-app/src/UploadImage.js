import React, { useState } from 'react';
import { CameraAltOutlined } from '@mui/icons-material';
import './App.css';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { ObservationImages } from './constants';

function UploadImage() {

  const [ image, setImage ] = useState();

  const [numberOfImage, setNumberOfImage ] = useState([1]);
  const [i, setI] = useState(1);
  let i1 = 1;

  const handleFileUpload = (e, id) => {
    e.preventDefault()
    setI(i1 += 1)
    setNumberOfImage(item => [...item, i]);
    console.log(id)

    if (!e.target.files[0]) {
        return
    }

    else {
        setImage(e.target.files[0])
    }
  }

  const updateBackground = () => {
    if (image) {
        return URL.createObjectURL(image)
    }
    else {
        return ""
    }
  }

  const handleRemovePhoto = () => {

  }

  const handleSavePhotos = async () => {

  }

  return (
    <div>
        <div className='image-input'
            style={{
            backgroundImage: image ? `url(${updateBackground()})` : "url('')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            }}
        >
            <IconButton aria-label="upload picture" component="label" style={{ visibility: image !== undefined ? "hidden" : "visible" }}>
            <CameraAltOutlined />
            <input accept='image/*' capture='environment' hidden type="file" onChange={(e) => handleFileUpload(e, id)}/>
            </IconButton>
            {image ? <div className="image-delete-btn"><ClearIcon /></div> : null}
            <p>{numberOfImage.length} + {id}</p>
        </div>
        <button className='submit' style={{backgroundColor: 'yellow', border: 0, height: 30, width: 100}}>Save Photos</button>
    </div>
  );
}

export default UploadImage;
