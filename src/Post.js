import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from 'firebase';
import { Box } from "@material-ui/core";


function Post({ postId, user, username, caption, imageUrl }) {

    //user: the user who signed in;
    //username: the user wrote the post;

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };

    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
    }

    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg ">
                </Avatar>
                <h3>{username}</h3>
            </div>



            <img className="post_image" src={imageUrl} alt="" />

            <h4 className="post_text"><strong>{username}</strong>: {caption}</h4>

            <div className="post_comments">
                {comments.map(comment => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
            <form className="post_commentBox">
                <input
                    className="post_input"
                    value={comment}
                    type="text"
                    placeholder="Add a comment.."
                    onChange={(e) => setComment(e.target.value)}>
                </input>
                <button
                    disabled={!comment}
                    className="post_button"
                    type="submit"
                    onClick={postComment}>
                    Post
                    </button>
            </form>
            )}
            {/* //有user， 才会有comment Box; */}
            



        </div>
    )

    
}

export default Post

//firebase is a service which allows you to create apps without needing servers.