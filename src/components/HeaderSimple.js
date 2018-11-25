import React from "react";
import styled from "styled-components";

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
  justify-content: center;
  align-items: center;
  max-width: 95%;
  /* width: 100%; */
  margin: 0 auto;
  height: 100%;
  h4 {
    margin-bottom: 0;
  }
`;

function HeaderSimple(props) {
  return (
    <React.Fragment>
      <HeaderOuter>
        <HeaderInner>
          <h3 className="text-center" style={{ color: "#492f91", margin: 0 }}>
            RxC Blog Editor
          </h3>
        </HeaderInner>
      </HeaderOuter>
    </React.Fragment>
  );
}

export default HeaderSimple;
