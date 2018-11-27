import React from "react";
import styled from "styled-components";
import moment from "moment";

const OuterWrap = styled.div`
  height: calc(100vh - 60px);
  position: absolute;
  width: 100%;
  top: 60px;
  overflow-y: scroll;
`;

const Image = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  background: cover;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  z-index: -1;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 32px;
`;

const Title = styled.div`
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
  h1 {
    color: #fff;
    margin: 0;
    font-size: 40px;
    font-weight: 400;
  }
`;

const Error = styled.h5`
  color: #fff;
`;

export default function Preview({ post, imageError }) {
  imageError = !post.image ? "[Missing image URL]" : imageError;
  return (
    <OuterWrap>
      <Image style={{ backgroundImage: `url(${post.image})` }}>
        <Overlay>
          <Title>
            <h1>{post.title}</h1>
            <Error>{imageError}</Error>
          </Title>
        </Overlay>
      </Image>
      <div className="author-date author">
        <h4>{post.author}</h4>
      </div>
      <div
        className="container preview"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="author-date date">
        <h4>
          Published{" "}
          {moment
            .parseZone(post.published)
            .utc()
            .format("MMM DD, YYYY")}
        </h4>
      </div>
    </OuterWrap>
  );
}
