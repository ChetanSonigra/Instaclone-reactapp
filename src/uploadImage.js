import React, {useState} from 'react';
import {Button, Input} from '@material-ui/core';
import './uploadImage.css';

function ImageUpload({authToken, authTokenType, userId}) {

  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL; 

  const createPost = (filename) => {
    const requestBody = JSON.stringify({
      'image_url': filename,
      'image_url_type': 'relative',
      'caption': caption,
      'creator_id': userId
    });

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken,
        'Content-Type': 'application/json'
      }),
      body: requestBody
    }
    // console.log(requestOptions);
    fetch(BASE_URL + 'post',requestOptions)
      .then(response => {
        if (response.ok) {
          console.log(response.json());
          return response;
        }
        throw response;
      })
      .then(data => {
        window.location.reload();
        window.scrollTo(0,0);
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })
  } 

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  const handleUpload = (e) => {
    e?.preventDefault();
    let formData = new FormData();
    formData.append('image',image);    
    const requestOptions = {
      method: 'POST',
      body: formData,
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken
      })
    }
    fetch(BASE_URL + 'post/image',requestOptions)
      .then(response => {
        if (response.ok) {
          const json_response = response.json();
          console.log(json_response);
          return json_response;
        }
        throw response;
      })
      .then(data => {
        console.log(data.filepath);
        createPost(data.filepath);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setCaption('');
        setImage(null);
        document.getElementById('fileInput').value=null;
      })      
  }
  return (
    <div className="imageupload">
      <Input
        type='text'
        placeholder='Enter a caption'
        onChange= {(e) => setCaption(e.target.value)}
        value={caption} />
      <Input
        type='file'
        onChange={handleChange}
        id='fileInput' />
      <Button
        className='imageupload_button'
        onClick={handleUpload}>
        Upload
      </Button>
    </div>
  )

}

export default ImageUpload;
