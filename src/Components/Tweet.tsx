import styled from "styled-components";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { auth, db, storage } from "../firebase";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const UpdateButton = styled.button`
  background-color: #74b72e;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");

    if (!ok || user?.uid !== userId) {
      return;
    }

    try {
      await deleteDoc(doc(db, "tweets", id));

      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    } finally {
      //
    }
  };

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
      //
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        <Buttons>
          {user?.uid === userId ? (
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          ) : null}
          {user?.uid === userId ? (
            <UpdateButton onClick={onUpdate}>Update</UpdateButton>
          ) : null}
        </Buttons>
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
