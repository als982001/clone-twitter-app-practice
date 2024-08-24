import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: pink;
  opacity: 0.3;
`;

const Modal = styled.div`
  width: 500px;
  min-height: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  opacity: 1;
  border-radius: 20px;
`;

interface IProps {
  closeModal: () => void;
}

const UpdateModal = ({ closeModal }: IProps) => {
  return (
    <>
      <Overlay onClick={closeModal} />
      <Modal>모달ㅋㅋㅋ</Modal>
    </>
  );
};

export default UpdateModal;
