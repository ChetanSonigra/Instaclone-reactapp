import React, { useState, useEffect } from 'react';
import './Post.css';
import { Avatar, Button } from '@material-ui/core';

const BASE_URL = process.env.REACT_APP_API_URL;

function Post({post,authToken, authTokenType, username}) {

  const [imageUrl, setImageUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const postComment = (e) => {
    e?.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        'username': username,
        'text': newComment,
        'post_id': post.id
      })
    }
      fetch(BASE_URL + 'comment/new',requestOptions)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then(data => {
          fetchComments();
        })
        .catch(e => {
          console.log(e);
          alert(e);
        })
        .finally(() => {
          setNewComment('');
        })
  }

  const fetchComments = () => {
    fetch(BASE_URL + 'comment/all/' + post.id)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setComments(data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleDelete = (event) => {
    event?.preventDefault();
    
      const requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken
      })
    }
    fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
      .then(response => {
        if (response.ok) {
          window.location.reload();
        }
        throw response;
      })
      .catch(error => {
        console.log(error);
      })
    
  }

  useEffect(() => {
    if (post.image_url_type == 'absolute') {
      setImageUrl(post.image_url)
    } else {
      setImageUrl(BASE_URL + post.image_url)
    }
  }, [])

  useEffect(() => {
    setComments(post.comments)
  
  },[])

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          alt="Catalin"
          src=""
        />
        <div className="post_header_info">
          <h3>{post.user.username}</h3>
          <Button className="post_delete"
                  onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <img className="post_image"
           src={imageUrl}
      />
      <h4 className="post_text">{post.caption}</h4>
      <div className="post_comments">
        {
          comments.map((comment) => (
            <p>
              <strong>{comment.username}: </strong>
              {comment.text} 
            </p>
          ))
        }
      </div>
      {authToken && (
        <form className="post_commentbox">
          <input className="post_comment_input"
                 type="text"
                 placeholder="Enter a Comment"
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)} />
          <button className="post_button"
                  type="submit"
                  disabled={!newComment}
                  onClick={postComment}>
            Post
          </button>
        </form> 
      )}
    </div>
  )
}

export default Post;

