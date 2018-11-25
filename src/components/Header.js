import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/lib/Form";
import Button from "react-bootstrap/lib/Button";
import moment from "moment";

const HeaderOuter = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #bbb;
  position: fixed;
  top: 0;
  background: #fff;
  /* box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1); */
`;
const HeaderInner = styled.div`
  display: flex;
  justify-content: ${({ isSignedIn }) =>
    isSignedIn ? "space-between" : "center"};
  align-items: center;
  max-width: 97%;
  /* width: 100%; */
  margin: 0 auto;
  height: 100%;
  h4 {
    margin-bottom: 0;
  }
`;
const ButtonWrapTop = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  button {
    min-width: 80px;
    margin-left: 0.6em;
  }
`;
const ButtonWrapSide = styled.div`
  margin: 0 auto;
  width: 300px;
  button {
    min-width: 300px;
    margin-top: 2em;
    height: 3em;
  }
  button:last-child {
    margin-top: 150px;
  }
  select {
    height: 3em;
  }
`;
const MenuBtn = styled.button`
  background: none;
  border: none;
  visibility: ${({ hidden }) => (hidden ? "hidden" : null)};
  i {
    font-size: 1.5em;
    color: #492f91;
    cursor: pointer;
  }
`;
const MenuBtnExit = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 1em;
  top: 1em;
  i {
    font-size: 1.5em;
    color: #492f91;
    cursor: pointer;
  }
`;
const SideNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  width: 100%;
  max-width: 450px;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: #fff;
  overflow-x: hidden;
  transition: 0.2s;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  /* border-right: 1px solid #bbb; */
  box-shadow: 40px 40px 40px rgba(10, 10, 10, 0.05);
`;

const Overlay = styled.div`
  z-index: 1;
  height: 100vh;
  width: 100vw;
  position: absolute;
`;

class Header extends React.Component {
  state = {
    sideNavOpen: false
  };

  previewClicked = () => {
    if (!this.props.preview) {
      this.props.saveOrPublish("quietSave");
    }
    this.props.togglePreview();
    this.closeSideNav();
  };

  publish = () => {
    this.props.validatePost();
    this.closeSideNav();
  };
  save = () => {
    this.props.saveOrPublish("save");
    this.closeSideNav();
  };
  dropDownChanged = e => {
    this.props.selectPost(e);
    this.closeSideNav();
    if (e.nativeEvent.target.value === "0") {
      this.props.forceEditView();
    }
  };

  openSideNav = () => {
    this.setState({ sideNavOpen: true });
  };
  closeSideNav = () => {
    this.setState({ sideNavOpen: false });
  };

  render() {
    const {
      posts,
      post,
      preview,
      promptForDelete,
      windowSize,
      cachedId,
      signOut,
      isSignedIn
    } = this.props;
    const { sideNavOpen } = this.state;

    let dropdownOptions = posts.map(post => {
      let date = moment
        .parseZone(post.published)
        .utc()
        .format("MMM DD, YYYY");
      return (
        <option
          key={post._id}
          value={post._id}
          selected={post._id === cachedId}
        >
          [{date}] {post.title}
        </option>
      );
    });

    dropdownOptions.unshift(
      <option key={0} value={0}>
        NEW POST
      </option>
    );

    let disabled =
      !post.title || !post.author || !post.image || !post.contentMD;

    const menuItems = (
      <React.Fragment>
        <Form.Group style={{ marginBottom: 0, display: "inline-block" }}>
          <Form.Control
            as="select"
            onChange={this.dropDownChanged}
            style={{ minWidth: "300px", width: "26vw" }}
          >
            {dropdownOptions}
          </Form.Control>
        </Form.Group>
        <Button variant="info" onClick={this.previewClicked}>
          {preview ? "Edit" : "Preview"}
        </Button>
        <Button
          variant="outline-success"
          disabled={disabled}
          onClick={this.save}
        >
          Save
        </Button>
        <Button
          variant="outline-success"
          disabled={disabled}
          onClick={this.publish}
        >
          Publish
        </Button>
        <Button
          variant="outline-danger"
          disabled={disabled}
          onClick={promptForDelete}
        >
          Delete
        </Button>
        <Button variant="outline-danger" onClick={signOut}>
          Sign Out
        </Button>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <SideNav open={sideNavOpen}>
          <MenuBtnExit onClick={this.closeSideNav}>
            <i className="fas fa-times" />
          </MenuBtnExit>
          <h3
            className="text-center"
            style={{ color: "#492f91", marginBottom: "3em" }}
          >
            RxC Blog Editor
          </h3>
          <ButtonWrapSide>{isSignedIn && menuItems}</ButtonWrapSide>
        </SideNav>
        {sideNavOpen && <Overlay onClick={this.closeSideNav} />}
        <HeaderOuter>
          <HeaderInner isSignedIn={isSignedIn}>
            <MenuBtn
              hidden={windowSize.x > 1000 || !isSignedIn}
              onClick={this.openSideNav}
            >
              <i className="fas fa-bars" />
            </MenuBtn>
            <h3 className="text-center" style={{ color: "#492f91", margin: 0 }}>
              RxC Blog Editor
            </h3>
            {windowSize.x > 1000 && isSignedIn && (
              <ButtonWrapTop>{menuItems}</ButtonWrapTop>
            )}
          </HeaderInner>
        </HeaderOuter>
      </React.Fragment>
    );
  }
}

export default Header;
