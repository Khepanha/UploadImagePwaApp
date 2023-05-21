import React, { useEffect, useState } from 'react';
import { CameraAltOutlined } from '@mui/icons-material';
import './App.css';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { ObservationImages } from './constants';

function UploadPhoto(props) {
    const { questionId, id, filename, onChange } = props;
    const [ image, setImage ] = useState();

    const handleFileUpload = (e) => {
        e.preventDefault()

        if (!e.target.files[0]) {
            return
        }

        const status = ObservationImages.addImage({
            id,
            questionId,
            image: e.target.files[0]
        })
        if (status.isSucess) {
            setImage(e.target.files[0])
            onChange(id, e.target.files[0].name)
        }
        else {
            e.target.value = ""
            setImage()
        }

        // else {
        //     setImage(e.target.files[0])
        // }
    }

    const updateBackground = () => {
        if (image) {
            return URL.createObjectURL(image)
        }
        else {
            return ""
        }
    }

    useEffect(() => {
        return () => {
            /* if it is used as image picker */
            if (onChange) {
                setImage()
                ObservationImages.removeImage({
                    id,
                    questionId,
                })
            }
        }
    }, [])

    useEffect(() => {
        if (filename === "") {
            setImage()
        }
        else {
            const currentObservationImage = ObservationImages.getImageOfObservation(questionId)
            const currentImage = currentObservationImage.filter(i => i.id === id)
            if (currentImage.length > 0) {
                setImage(currentImage[0].image)
            }
        }
    }, [filename])

    return (
        <>
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
                    <input accept='image/*' capture='environment' hidden type="file" onChange={handleFileUpload}/>
                </IconButton>
                {image ? <div className="image-delete-btn"><ClearIcon /></div> : null}
            </div>
        </>
    );
}

export default UploadPhoto;
