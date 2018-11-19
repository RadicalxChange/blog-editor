import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/lib/Form";

const OuterWrap = styled.div`
  height: calc(100vh - 60px);
  position: absolute;
  width: 100%;
  top: 60px;
  /* padding-top: 60px; */
  overflow-y: scroll;
`;

class BlogForm extends React.Component {
  render() {
    const { post, handleChange } = this.props;

    return (
      <OuterWrap>
        <div className="container">
          <Form style={{ paddingTop: "1em" }}>
            <Form.Group controlId="author">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Author"
                value={post.author}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                value={post.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="brief">
              <Form.Label>Synopsis</Form.Label>
              <Form.Control
                type="text"
                placeholder="Synopsis"
                value={post.brief}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Header Image</Form.Label>
              <Form.Control
                type="url"
                placeholder="Preview Image"
                value={post.image}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="contentMD">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows="20"
                value={post.contentMD}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </div>
      </OuterWrap>
    );
  }
}

export default BlogForm;
