import React, { useEffect, useState } from 'react';
import './App.css';
import UploadPhoto from './UploadPhoto';
import { ObservationImages } from './constants';
import Resizer from "react-image-file-resizer";
import axios from 'axios';

function App() {

  const [numberOfImage, setNumberOfImage] = useState([{id:1, filename: ""}])

  const platform = window.navigator.platform;
  const appVersion = window.navigator.userAgent;

  const addImage = (id, filename) => {
      const temp = numberOfImage
      temp.forEach(t => {
          if(t.id === id){
              t.filename = filename
          }
      })
      const currentLength = numberOfImage.length
      if (currentLength < 4) {
          temp.push({id: numberOfImage.length + 1, filename: ""})
      }
      setNumberOfImage([...temp])
  }

  const getHeightAndWidthFromDataUrl = dataURL => new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
        resolve({
            height: img.height,
            width: img.width
        })
    }
    img.src = dataURL
  })

  const resizeFile = (file, width, height) => new Promise(resolve => {
    let maxWidth = 0
    let maxHeight = 0
    if (width > height) {
        maxWidth = 506
        maxHeight = 380
    }
    else {
        maxWidth = 380
        maxHeight = 506
    }
    const type = file.type.split("/")[1]
    Resizer.imageFileResizer(file, maxWidth, maxHeight, type.toUpperCase(), 60, 0,
        uri => {
            resolve(uri);
        }, 'file');
  });

  const getImageDimensions = (image) => {
    return new Promise((resolve, reject) => {
      image.onload = function(e){
          const width = this.width;
          const height = this.height;
          resolve({height, width});
      }
    }); 
  }

  const compressImage = (image, name, imageType, scale, initalWidth, initalHeight) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");

      canvas.width = scale * initalWidth;
      canvas.height = scale * initalHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      ctx.canvas.toBlob((blob) => { 
          const resizedFile = new File([blob], name, {type: imageType});
          resolve(resizedFile);
      }, imageType);

    })
  }

  const handleSavePhoto = async (id_controle) => {
    const observationImages = ObservationImages.getImage();
    let imageCount = observationImages.length

    for (let image of observationImages) {
      const requestData = new FormData();
      // if (image.image.size <= 51200) { // if less then 50KB no need to resize
      //     requestData.append("file", image.image)
      // }
      // else {
      //   const fileAsDataURL = window.URL.createObjectURL(image.image)
      //   const dim = await getHeightAndWidthFromDataUrl(fileAsDataURL)
      //   const resizeImage = await resizeFile(image.image, dim.width, dim.height)
      //   // alert(resizeImage);
      //   // alert(window.URL.createObjectURL(image.image));
      //   requestData.append("file", resizeImage);
      // }

      //-------------------------------

      console.log("image type: ", image.image.type);
      console.log("before compress: ", window.URL.createObjectURL(image.image))
      const inputImage = new Image();
      inputImage.src = window.URL.createObjectURL(image.image);
      const {height, width} = await getImageDimensions(inputImage);
      const MAX_WIDTH = 200;
      const MAX_HEIGHT = 200;

      const widthRatioBlob = await compressImage(inputImage, image.image.name, image.image.type, MAX_WIDTH / width, width, height); 
      const heightRatioBlob = await compressImage(inputImage, image.image.name, image.image.type, MAX_HEIGHT / height, width, height);

      const compressedBlob = widthRatioBlob.size > heightRatioBlob.size ? heightRatioBlob : widthRatioBlob;

      const outputPreviewSrc = window.URL.createObjectURL(compressedBlob);

      requestData.append("file", compressedBlob);

      console.log("compressed blob: ", compressedBlob);
      console.log("out put preview source: ", outputPreviewSrc);

      // const optimalBlob = compressedBlob.size < image.image.size ? compressedBlob : image.image; 
      // console.log(`Inital Size: ${image.image.size}. Compressed Size: ${optimalBlob.size}`);

      const uploadRes = await axios({
        url: `https://hydrotest2.frckb.net/_test_beta/webservices/ws_savephoto.php?key=1008920445&user=24274e234d658e7139492aeaacaac1a5&app=3b85a250f0e693d21cb33ec55df6c494&id_controle=${id_controle}&id_question=${image.questionId}&nb_photos=1`,
        method: "POST",
        data: requestData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      console.log(JSON.stringify(uploadRes));

      if (uploadRes.status !== 200) {
        return;
      }
      const rewriteRes = `https://hydrotest2.frckb.net/_test_beta/webservices/ws_rewritepdf.php?id_controle=${id_controle}`
      console.log("url:  ------- ", rewriteRes);

      // alert (rewriteRes + "   " + JSON.stringify(uploadRes));

      imageCount -= 1;
    }
    return imageCount;
  }
  // const [text, setText] = useState('');

  // useEffect(() => {
  //   const imageInput = document.getElementById("image-input");
  //   setText(imageInput);
  //   console.log("Image input: ", imageInput);
  // }, [])

  return (
    <>
      <div>
        <p>OS: {platform}</p>
        <p>appVersion: {appVersion}</p>
      </div>
      {numberOfImage.map((id) => {
        return <div>
          <UploadPhoto questionId={2993} id={id.id} filename={id.filename} onChange={addImage}/>
        </div>
      })}
      <button onClick={() => handleSavePhoto(25314)} className='submit' style={{backgroundColor: 'yellow', border: 0, height: 30, width: 100}}>Save Photo</button>
    </>
  );
}

export default App;
