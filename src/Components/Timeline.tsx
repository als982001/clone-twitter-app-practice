import { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "../firebase";
import Tweet from "./Tweet";

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );

    console.log(tweetQuery);

    const snapshot = await getDocs(tweetQuery);

    console.log(snapshot);

    const tweets: ITweet[] = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();

      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });

    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
