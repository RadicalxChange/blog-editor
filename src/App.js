import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase";
import { configDev as config } from "./hoverboardConfig";
import { formatForHoverboard } from "./helpers";
import Main from "./components/Main";
import Header from "./components/Header";
import Register from "./components/Register";
import MsgModal from "./components/MsgModal";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./scss/index.css";
import "./App.css";

const md = require("markdown-it")({
  html: false,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true
});

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};

////// FIREBASE SETUP

const settings = { timestampsInSnapshots: true };

const hoverInit = firebase.initializeApp(config.hoverboard);
const hoverDB = hoverInit.firestore();
hoverDB.settings(settings);

const rxcInit = firebase.initializeApp(config.rxcBlog, "secondary");
const rxcDB = rxcInit.firestore();
rxcDB.settings(settings);

///////// APP

class App extends React.Component {
  constructor(props) {
    super(props);
    this.newPost = {
      _id: 0,
      author: "",
      title: "",
      brief: "",
      published: this.getTodayDate(),
      image: "",
      content: "",
      contentMD: ""
    };

    this.state = {
      posts: [],
      post: { ...this.newPost },
      preview: false,
      imageError: "",
      errorMsg: "",
      successMsg: "",
      modalShowing: false,
      deleteCalled: false,
      windowSize: { x: window.innerWidth, y: window.innerHeight },
      cachedId: "",
      isSignedIn: false,
      registerSuccess: false
    };

    this.getTodayDate = this.getTodayDate.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.getSize);

    this.unregisterAuthObserver = rxcInit.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
    });

    this.getPosts();
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  getPosts = () => {
    rxcDB
      .collection("blog")
      .get()
      .then(res => {
        let posts = [];
        res.forEach(doc => {
          let post = doc.data();
          post._id = doc.id;
          posts.push(post);
        });
        this.setState({ posts });
      });
  };

  selectPost = ({ nativeEvent }) => {
    let [post] = this.state.posts.filter(
      p => p._id === nativeEvent.target.value
    );
    if (!post) {
      post = { ...this.newPost };
    }
    post.content = md.render(post.contentMD);
    this.setState({ post, cachedId: post._id });
  };

  togglePreview = () => {
    let content = md.render(this.state.post.contentMD);
    const { post } = this.state;
    post.content = content;
    this.setState(prevState => ({
      preview: !prevState.preview,
      post: post
    }));
  };
  forceEditView = () => {
    this.setState({ preview: false });
  };

  closeModal = () => {
    this.setState({ modalShowing: false });
    setTimeout(() => {
      this.setState({
        errorMsg: "",
        successMsg: "",
        deleteCalled: false
      });
    }, 1000);
  };

  showModal = () => {
    this.setState({ modalShowing: true });
  };

  getSize = () => {
    const windowSize = {
      x: window.innerWidth,
      y: window.innerHeight
    };
    this.setState({
      windowSize
    });
  };

  saveOrPublish = button => {
    const { post } = this.state;
    if (this.state.errorMsg) return;

    const db = button === "save" || button === "quietSave" ? rxcDB : hoverDB;

    /// TODO:  move this into an error check handler
    if (!post.title || !post.contentMD || !post.image || !post.author)
      return null;

    let { title } = post;
    let urlString = post.published + "-" + title.replace(/[\W_]+/g, "-");
    let newId =
      post.published +
      "-" +
      Math.random()
        .toString(36)
        .substr(2, 6);
    let parsedMD = md.render(post.contentMD);
    let content = formatForHoverboard(parsedMD);

    if (!post._id) {
      post._id = newId;
      this.setState({ post });
    }

    db.collection("blog")
      .doc(post._id || newId)
      .set({
        title: post.title,
        brief: post.brief,
        author: post.author,
        image: post.image,
        content: content,
        contentMD: post.contentMD,
        published: post.published,
        source: `/data/blog/${urlString}`,
        backgroundColor: "#492F91"
      })

      .then(doc => {
        if (button === "publish") {
          this.setState({
            successMsg: "Published!",
            cachedId: post._id || newId
          });
          this.showModal();
          this.saveOrPublish("quietSave");
        }
        if (button === "save") {
          this.setState({ successMsg: "Saved!", cachedId: post._id });
          this.showModal();
        }
        this.getPosts();
      })
      .catch(err => {
        console.error("Error adding document: ", err);
      });
  };

  validatePost = () => {
    const { post } = this.state;
    const imageValid = post.image.match(/(https?:\/\/.*\.(?:png|jpg|gif))/i);
    if (!post.author) {
      this.setState({ errorMsg: "Please specify author." });
      this.showModal();
      return;
    }
    if (!post.title) {
      this.setState({ errorMsg: "Please provide a title." });
      this.showModal();
      return;
    }
    if (post.brief.length > 250) {
      this.setState({
        errorMsg: "Please shorten synopsis to 250 characters or less."
      });
      this.showModal();
      return;
    }
    if (!imageValid) {
      this.setState({
        errorMsg:
          "Invalid or missing header image. Please provide a URL to a large jpg, png or gif."
      });
      this.showModal();
      return;
    }
    if (!post.contentMD) {
      this.setState({
        errorMsg: "You haven't written any content to publish. :)"
      });
      this.showModal();
      return;
    }
    this.setState({ errorMsg: "" });
    this.saveOrPublish("publish");
  };

  promptForDelete = () => {
    this.setState({ errorMsg: "Are you sure?", deleteCalled: true }, () => {
      this.showModal();
    });
  };

  deletePost = () => {
    const id = this.state.post._id;
    hoverDB
      .collection("blog")
      .doc(id)
      .delete()
      .then(() => {
        this.getPosts();
        this.setState({
          deleteCalled: false,
          errorMsg: "",
          post: { ...this.newPost },
          cachedId: id,
          successMsg: "Successfully Deleted!"
        });
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
    rxcDB
      .collection("blog")
      .doc(id)
      .delete()
      .then(() => {
        this.setState({
          deleteCalled: false,
          post: { ...this.newPost },
          cachedId: id,
          successMsg: "Successfully Deleted!"
        });
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };

  getTodayDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  handleChange = e => {
    const { post } = this.state;
    const id = e.target.id;
    post[id] = e.target.value;
    this.setState({ post });
  };

  register = (e, credentials) => {
    e.preventDefault();

    rxcDB
      .collection("users")
      .doc("admins")
      .get()
      .then(res => {
        const admins = res.data().admins;

        // checks against list of authorized email addresses
        if (admins.includes(credentials.email)) {
          rxcInit
            .auth()
            .createUserWithEmailAndPassword(
              credentials.email,
              credentials.password
            )
            .then(() => {
              this.setState({ registerSuccess: true });
              rxcInit.auth().currentUser.updateProfile({
                displayName: credentials.fullName
              });
            })
            .catch(error => {
              var errorMessage = error.message;
              console.log(errorMessage);
              this.setState({ modalShowing: true, errorMsg: errorMessage });
            });
        } else {
          this.setState({
            modalShowing: true,
            errorMsg:
              "That email address isn't authorized. Contact Matthew Masurka to add it: m.masurka@gmail.com"
          });
        }
      });
  };

  render() {
    const {
      posts,
      post,
      preview,
      imageError,
      successMsg,
      errorMsg,
      modalShowing,
      deleteCalled,
      windowSize,
      cachedId,
      isSignedIn,
      registerSuccess
    } = this.state;

    return (
      <React.Fragment>
        <Header
          posts={posts}
          post={post}
          selectPost={this.selectPost}
          togglePreview={this.togglePreview}
          preview={preview}
          saveOrPublish={this.saveOrPublish}
          getPost={this.getPost}
          validatePost={this.validatePost}
          promptForDelete={this.promptForDelete}
          windowSize={windowSize}
          forceEditView={this.forceEditView}
          cachedId={cachedId}
          signOut={() => rxcInit.auth().signOut()}
          isSignedIn={isSignedIn}
        />
        <Router>
          <React.Fragment>
            <Route
              path="/register"
              exact
              render={() => (
                <Register
                  register={this.register}
                  registerSuccess={registerSuccess}
                />
              )}
            />
            <MsgModal
              show={modalShowing}
              closeModal={this.closeModal}
              errorMsg={errorMsg}
              successMsg={successMsg}
            />
            <Route
              path="/"
              exact
              render={() => (
                <Main
                  posts={posts}
                  post={post}
                  preview={preview}
                  imageError={imageError}
                  successMsg={successMsg}
                  errorMsg={errorMsg}
                  modalShowing={modalShowing}
                  deleteCalled={deleteCalled}
                  windowSize={windowSize}
                  cachedId={cachedId}
                  isSignedIn={isSignedIn}
                  handleChange={this.handleChange}
                  closeModal={this.closeModal}
                  deletePost={this.deletePost}
                  firebaseAuth={rxcInit.auth()}
                  uiConfig={uiConfig}
                />
              )}
            />
          </React.Fragment>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
