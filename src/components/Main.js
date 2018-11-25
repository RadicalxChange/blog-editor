import React, { Component } from "react";
import BlogForm from "./BlogForm";
import Preview from "./Preview";
import MsgModal from "./MsgModal";
import SignIn from "./SignIn";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../scss/index.css";
import "../App.css";

class Main extends Component {
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
      isSignedIn,
      handleChange,
      closeModal,
      deletePost,
      firebaseAuth,
      uiConfig
    } = this.props;
    return (
      <React.Fragment>
        {!isSignedIn ? (
          <SignIn uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
        ) : preview ? (
          <Preview post={post} imageError={imageError} />
        ) : (
          <BlogForm posts={posts} post={post} handleChange={handleChange} />
        )}
        <MsgModal
          show={modalShowing}
          closeModal={closeModal}
          errorMsg={errorMsg}
          successMsg={successMsg}
          deleteFunc={deletePost}
          deleteCalled={deleteCalled}
        />
      </React.Fragment>
    );
  }
}

export default Main;
