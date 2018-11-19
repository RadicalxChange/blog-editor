import React from "react";
import styled from "styled-components";
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";

const ModalInner = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  min-width: 300px;
  min-height: 200px;
  
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
    <Modal show={show} onHide={closeModal} centered id="modal-override">
      <ModalInner success={successMsg}>
        <div>{errorMsg || successMsg}</div>
        {deleteCalled && (
          <div style={{ paddingTop: "1em" }}>
            <Button
              variant="outline-success"
              className="mr-1"
              size="lg"
              onClick={deleteFunc}
            >
              Yes
            </Button>
            <Button
              variant="outline-danger"
              className="ml-1"
              size="lg"
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
