import { useState } from "react";
import styled from "styled-components";

import useHandleImage from "../Hooks/useHandleImage";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: pink;
  opacity: 0.3;
`;

const Modal = styled.form`
  width: 500px;
  min-height: 500px;
  max-height: 80vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #000;
  padding: 20px;
  opacity: 1;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Image = styled.img`
  max-height: 250px;
  border-radius: 20px;
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const Content = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &::placeholder {
    font-size: 16px;
  }

  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Buttons = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
`;

const Button = styled.button`
  width: 150px;
  height: 40px;
  border: none;
  font-size: 15px;
  border-radius: 10px;
  color: #fff;
`;

interface IProps {
  tweet: ITweet;
  closeModal: () => void;
}

const UpdateModal = ({ tweet, closeModal }: IProps) => {
  const { id, photo, tweet: tweetContent } = tweet;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>(tweetContent);
  const { file, imageUrl, handleChangeImage } = useHandleImage({
    initialImageUrl: photo,
  });

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user || isLoading || !content || content.length > 180) {
      return;
    }

    try {
      setIsLoading(true);

      const updatedData: { tweet: string; updatedAt: any; photo?: string } = {
        tweet: content,
        updatedAt: Date.now(),
      };

      const tweetDocRef = doc(db, "tweets", id);

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const newUrl = await getDownloadURL(result.ref);

        updatedData.photo = newUrl;
      }

      await updateDoc(tweetDocRef, updatedData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <Overlay onClick={closeModal} />
      <Modal>
        {imageUrl && <Image src={imageUrl} />}
        <AttachFileButton htmlFor="updateFile">
          {file ? "Photo added ✅" : "Add photo"}
        </AttachFileButton>
        <AttachFileInput
          id="updateFile"
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
        />
        <Content
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
        >
          {content}
        </Content>
        <Buttons>
          <Button onClick={handleUpdate} style={{ backgroundColor: "#1d9bf0" }}>
            수정
          </Button>
          <Button
            onClick={closeModal}
            style={{ backgroundColor: "#000", border: "1px solid #1d9bf0" }}
          >
            닫기
          </Button>
        </Buttons>
      </Modal>
    </>
  );
};

export default UpdateModal;
