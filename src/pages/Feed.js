import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import Navbar from '../components/Navbar';
import './styles/Feed.css';
import '@fortawesome/fontawesome-free/css/all.css';

function Feed() {
  const [postContent, setPostContent] = useState('');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const updatedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(updatedPosts);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const user = firebase.auth().currentUser;

    if (!user) {
      console.log('User not authenticated. Please sign in.');
      return;
    }

    try {
      if (file) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`postFiles/${file.name}`);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();

        await firebase.firestore().collection('posts').add({
          content: postContent,
          fileUrl: fileUrl,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          userId: user.uid,
          username: user.displayName
        });
      } else {
        await firebase.firestore().collection('posts').add({
          content: postContent,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          userId: user.uid,
          username: user.displayName
        });
      }

      setPostContent('');
      setFile(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleLike = async (postId) => {
    const user = firebase.auth().currentUser;

    if (!user) {
      console.log('User not authenticated. Please sign in.');
      return;
    }

    try {
      const postRef = firebase.firestore().collection('posts').doc(postId);
      const postSnapshot = await postRef.get();
      const postData = postSnapshot.data();

      const userLikedPost = postData.likes && postData.likes.includes(user.uid);

      if (userLikedPost) {
        // User already liked the post, so unlike it
        const updatedLikes = postData.likes.filter((like) => like !== user.uid);
        await postRef.update({ likes: updatedLikes });
      } else {
        // User didn't like the post, so like it
        const updatedLikes = [...(postData.likes || []), user.uid];
        await postRef.update({ likes: updatedLikes });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleCommentSubmit = async (postId, commentContent) => {
    const user = firebase.auth().currentUser;

    if (!user) {
      console.log('User not authenticated. Please sign in.');
      return;
    }

    try {
      const postRef = firebase.firestore().collection('posts').doc(postId);
      const postSnapshot = await postRef.get();
      const postData = postSnapshot.data();

      const updatedComments = [
        ...(postData.comments || []),
        {
          userId: user.uid,
          username: user.displayName,
          content: commentContent,
          timestamp: new Date() // Use JavaScript Date object for timestamp
        }
      ];

      await postRef.update({ comments: updatedComments });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="feed">
      <Navbar />
      <div className="feed__container">
        <div className="feed__inputContainer">
          <form className="feed__form">
            <input
              type="text"
              placeholder="Write a caption..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <input type="file" onChange={handleFileUpload} />
            <button type="submit" onClick={handlePostSubmit}>
              Post
            </button>
          </form>
        </div>

        <div className="feed__postsContainer">
          {posts.map((post) => (
            <div className="feed__post" key={post.id}>
              <div className="feed__postHeader">
              <Link to="/sender">
                  <img
                    className="feed__postAvatar"
                    src={`https://ui-avatars.com/api/?name=${post.username}`}
                    alt={post.username}
                  />
                  <h3>{post.username}</h3>
                </Link>
              </div>
              {post.fileUrl && (
                <div className="feed__postFile">
                  {post.fileUrl.endsWith('.pdf') ? (
                    <a href={post.fileUrl} target="_blank" rel="noopener noreferrer">
                      Open PDF Document
                    </a>
                  ) : (
                    <img className="feed__postImage" src={post.fileUrl} alt="" />
                  )}
                </div>
              )}
              <p>{post.content}</p>

              <div className="feed__postActions">
                <button onClick={() => handleLike(post.id)}>
                  {post.likes && post.likes.includes(firebase.auth().currentUser?.uid) ? (
                    <i className="fas fa-heart"></i>
                  ) : (
                    <i className="far fa-heart"></i>
                  )}
                </button>
                <span>{post.likes && post.likes.length}</span>
                <button>
                  <i className="far fa-comment"></i>
                </button>
              </div>

              <div className="feed__postComments">
                {post && post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div className="feed__postComment" key={index}>
                      <strong>{comment.username}</strong> {comment.content}
                    </div>
                  ))
                ) : (
                  <p>No comments</p>
                )}
              </div>

              <form className="feed__commentForm">
                <input type="text" placeholder="Add a comment..." />
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    const commentContent = e.target.previousSibling.value.trim();
                    if (commentContent) {
                      handleCommentSubmit(post.id, commentContent);
                      e.target.previousSibling.value = '';
                    }
                  }}
                >
                  Post
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
