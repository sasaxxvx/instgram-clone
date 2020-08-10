import React, { useState, useEffect } from 'react';
import './App.css'
import Post from "./Post";
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;
  // in the midlle of the page 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle)
  const [posts, setPosts] = useState([
    // get rid of the hardcode part
    // {username: "Cleverqazi",
    //   caption: "WOW, it really works",
    //   imageUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    // },
    // {username: "YuxuanChen",
    //   caption: "Happing coding and happing hacking",
    //   imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
    // }
    // useState sets posts to be a []
  ]);
  // useState is a hook here

  // useEffect -> runs a peice of code based on a specific condition,
  // here, it runs evert time a comment happens,
  // [the condition], leaving it blank will make the callback func run only once
  // when the App component loads;
  // [posts], will make the callback run once when the App component loads/page refreshes ,
  //  but also, every single time when the variable [posts] change. -> everytime 
  // [posts] change, run this code again
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  // useState sets email to be a [];
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState('');


  useEffect(() => {
    // listen for any authentication change happens, login/logout
    const unsubscribe = auth.onAuthStateChanged((authUser => {
      if (authUser) {
        // user has logged in 
        console.log(authUser)
        setUser(authUser);
        // survives a refresh, say you logged in, then you refresh, 
        // it would go and check and see you still logged in cuz
        // it uses cookied tracking
      } else {
        // user has logged out
        setUser(null);
      }
    }))
    return () => {
      // perform some cleanup actions
      unsubscribe();
    }


  }, [user, username]);



  useEffect(() => {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every single time a new post is added/posts changes, this code fires
      // data() will give all the properties, here username, caption, imageUrl..
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    // we always have the preventDefault otherwise it will cause a refresh of the page when we submit the form
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    // createUserWithEmailAndPassword gives you back-end validations
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message))

    setOpenSignIn(false);

  }


  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => { setOpen(false) }}>
        {/* onClose is listening for any clicks outside from the modal */}
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="" />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e => setPassword(e.target.value))}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>



        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => { setOpenSignIn(false) }}>
        {/* onClose is listening for any clicks outside from the modal */}
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="" />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e => setPassword(e.target.value))}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>



        </div>
      </Modal>

      <div className="app_header">
        <img className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="" />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app_loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>

          )}
      </div>





      <div className="app_posts">
        <div className="app_postsLeft">{
          posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
        </div>

        <div className="app_postsRight"> 
          <InstagramEmbed
            url='https://www.instagram.com/p/B_ykeRIHPfN/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
          </div>



        
      </div>



      {user?.displayName ?
        (<ImageUpload username={user.displayName} />) :
        (
          <h3>Sorry, you need to login</h3>
        )
      }



    </div>
  );
}

export default App;
