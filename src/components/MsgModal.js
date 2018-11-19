import React from "react";
import styled from "styled-components";
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";

const ModalInner = styled.div`
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  /* border: 20px solid ${({ success }) => (success ? "green" : "red")}; */
  background: #fff;
`;

const MsgModal = ({
  show,
  closeModal,
  errorMsg,
  successMsg,
  deleteFunc,
  deleteCalled
}) => {
  return (
    <Modal show={show} onHide={closeModal} centered>
      <ModalInner success={successMsg}>
        {errorMsg || successMsg}
        {deleteCalled && (
          <div>
            <Button
              variant="outline-success"
              className="ml-3"
              size="large"
              onClick={deleteFunc}
            >
              Yes
            </Button>
            <Button
              variant="outline-danger"
              className="ml-3"
              size="large"
              onClick={closeModal}
            >
              No
            </Button>
          </div>
        )}
      </ModalInner>
    </Modal>
  );
};

export default MsgModal;
