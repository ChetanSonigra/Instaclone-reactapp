import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post.js';
import {Button, Modal, makeStyles, Input} from "@material-ui/core";
import ImageUpload from './uploadImage.js';

const BASE_URL = process.env.REACT_APP_API_URL;

function getModalStyle() {
 
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`
  };
}


const useStyles = makeStyles((theme) => ({

  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3)
  }

}))

function App() {

  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [opensignin, setOpenSignIn] = useState(false);
  const [opensignup, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedAuthToken = window.localStorage.getItem('authtoken');
    const storedAuthTokenType = window.localStorage.getItem('tokentype');
    const storedUserId = window.localStorage.getItem('userid');
    const storedUserName = window.localStorage.getItem('username');
    if (storedAuthToken) {
    setAuthToken(storedAuthToken);}
    if (storedAuthTokenType) {
    setAuthTokenType(storedAuthTokenType);}
    if (storedUserId) {
    setUserId(storedUserId);}
    if (storedUserName) {
    setUserName(storedUserName);}
  })


  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem('authtoken',authToken);
      window.localStorage.setItem('tokentype',authTokenType);
      window.localStorage.setItem('userid', userId);
      window.localStorage.setItem('username', username);
    } else {
      window.localStorage.removeItem('authtoken');
      window.localStorage.removeItem('tokentype');
      window.localStorage.removeItem('userid');
      window.localStorage.removeItem('username');
    }
  },[authToken,authTokenType,userId])

  useEffect(() => {
    fetch(BASE_URL + 'post/all')
      .then(response => {
        const json = response.json();
        console.log(json);
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        const result = data.sort((a,b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);
          const d_a = new Date(Date.UTC(t_a[0], t_a[1], t_a[2], t_a[3], t_a[4], t_a[5]));
          const d_b = new Date(Date.UTC(t_b[0], t_b[1], t_b[2], t_b[3], t_b[4], t_b[5]));
          return d_b - d_a;
        })
        return result
      })
      .then(data => {
        setPosts(data)
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })
    
  }, []) 

  const signin = (event) => {
    event?.preventDefault();
    
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const requestOptions = {
      method: 'POST',
      body: formData
    }   
 
    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data);
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
      })
      .catch(error => {
        console.log(error);
        alert(error)
      })
      setOpenSignIn(false);
  }

  const signOut = (event) => {
    setAuthToken(null);
    window.localStorage.removeItem('authtoken');
    setAuthTokenType(null);
    setUserId('');
    setUserName('');
  }

  const signUp = (event) => {
    event?.preventDefault();
    
    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    })

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: json_string
    }  
    fetch(BASE_URL + 'user/', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        // console.log(data);
        signin();
      })
      .catch(error => {
        console.log(error);
        alert(error)
      })

    setOpenSignUp(false)
  }

  return (
    <div className="app">
      <Modal
        open={opensignin}
        onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img className="app_header_img"
                   src="https://rtcinfo.weebly.com/uploads/1/5/0/5/15052668/insta-logo_orig.jpg"
                   alt="Instagram"/>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)} />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button
              type="submit"
              onClick={signin}>Login</Button>
          </form>
        </div>
      </Modal>
      
      <Modal
        open={opensignup}
        onClose={() => setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img className="app_header_img"
                   src="https://rtcinfo.weebly.com/uploads/1/5/0/5/15052668/insta-logo_orig.jpg"
                   alt="Instagram"/>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)} />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button
              type="submit"
              onClick={signUp}>SignUp</Button>
          </form>
        </div>
      </Modal>

      <div className="app_headers">
        <img className="app_header_img"
             src="https://rtcinfo.weebly.com/uploads/1/5/0/5/15052668/insta-logo_orig.jpg"
             alt="Instagram"/>
        {authToken ? (
          <Button onClick={() => signOut()}>Logout</Button>
          ) : (
            <div>
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpenSignUp(true)}>SignUp</Button>
            </div>
          )
        }
      </div>
      <div className="app_posts">
        {
          posts.map(post => (
            <Post
              post = {post}
              authToken={authToken}
              authTokenType={authTokenType}
              username={username}
            />
            )
          )
        }
      </div>
      
      {
      authToken
        ? (
        <ImageUpload
          authToken={authToken}
          authTokenType={authTokenType}   
          userId={userId}       
        />
      )
        : (
        <h3>You need to login to upload</h3>
      )
      }
    </div>
    );
}

export default App;
