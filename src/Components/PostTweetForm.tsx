import { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";

import { auth, db, storage } from "../firebase";
import { getFileSize } from "../utils/functions";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
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

const Image = styled.img`
  max-width: 100%;
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tweet, setTweet] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;

    setTweet(value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;

    if (files && files.length === 1) {
      const file = files[0];
      const fileSize = getFileSize(file.size);

      if (fileSize > 1500) {
        alert("파일이 너무 큽니다!");
        return;
      }

      setFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user || isLoading || !tweet || tweet.length > 180) {
      return;
    }

    try {
      setIsLoading(true);

      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);

        const result = await uploadBytes(locationRef, file);

        const url = await getDownloadURL(result.ref);

        await updateDoc(doc, { photo: url });
      }

      setTweet("");
      setFile(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="Tweet"
      />
      {file && (
        <Image
          src={
            imageUrl ??
            "https://pbs.twimg.com/media/GVq9qsxbAAA8oTH?format=jpg&name=4096x4096"
          }
        />
      )}
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
}
