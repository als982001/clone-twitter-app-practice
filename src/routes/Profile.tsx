import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isNull } from "lodash";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import Tweet from "../Components/Tweet";
import { auth, db, storage } from "../firebase";
import { DeleteButton, UpdateButton } from "../Styles/Buttons";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const NameInput = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 50%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    background-color: #1d9bf0;
    color: white;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;

  const [avatar, setAvatar] = useState<string | null | undefined>(
    user?.photoURL
  );
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [updatedName, setUpdatedName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNull(user)) {
      return;
    }

    const { files } = e.target;

    if (files && files.length === 1) {
      const file = files[0];

      const locationRef = ref(storage, `avatar/${user?.uid}`);

      const result = await uploadBytes(locationRef, file);

      const avatarUrl = await getDownloadURL(result.ref);

      setAvatar(avatarUrl);

      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const fetchTweets = async () => {
    if (isNull(user)) {
      return;
    }

    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      // orderBy("createdAt", "desc"),
      limit(25)
    );

    const snapshot = await getDocs(tweetQuery);

    const tweets: ITweet[] = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();

      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });

    setTweets(tweets);
  };

  const handleChangeName = async () => {
    if (isLoading || !user) {
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile(user, { displayName: updatedName });

      const tweetUpdatePromises = tweets.map((tweet) => {
        const tweetDocRef = doc(db, "tweets", tweet.id);

        return updateDoc(tweetDocRef, { username: updatedName });
      });

      await Promise.all(tweetUpdatePromises);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setUpdate(false);
      setUpdatedName("");
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user?.displayName]);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {update ? (
        <NameInput
          value={updatedName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUpdatedName(e.target.value)
          }
        />
      ) : (
        <Name>{user?.displayName ?? "Anonymous"}</Name>
      )}
      <Buttons>
        <UpdateButton
          onClick={() => {
            if (update) {
              handleChangeName();
            } else {
              setUpdatedName(user?.displayName as string);
              setUpdate(true);
            }
          }}
        >
          Update
        </UpdateButton>
        {update && (
          <DeleteButton
            onClick={() => {
              setUpdate(false);
              setUpdatedName("");
            }}
          >
            Cancel
          </DeleteButton>
        )}
      </Buttons>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
4;
