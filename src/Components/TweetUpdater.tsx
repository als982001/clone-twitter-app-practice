/*
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
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

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;

  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
  */

interface IProps {
  tweet: ITweet;
}

export default function TweetUpdater({ tweet }: IProps) {
  tweet;

  return null;
  /*
  const { username, photo, userId, id } = tweet;

  const [tweet];

  const user = auth.currentUser;

  const onUpdate = async () => {
    if (user?.uid !== userId) {
      return;
    }

    try {
      console.log({ username, photo, tweet, userId, id });

      const tweetRef = doc(db, "tweets", id);

      await updateDoc(tweetRef, { tweet: "임의로 업데이트 시킴 ㅋ" });
    } catch (e) {
      console.error(e);
    } finally {
      // setUpdateTweet(false);
    }
  };

  return (
    <Form onSubmit={onUpdate}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="Tweet"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        id="file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
  */
}
