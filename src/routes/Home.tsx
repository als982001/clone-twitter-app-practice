import styled from "styled-components";

import PostTweetForm from "../Components/PostTweetForm";
import Timeline from "../Components/Timeline";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  const [updateTweet, setUpdateTweet] = useState<boolean>(false);

  const handleUpdate = (updateStatus: boolean) => {
    setUpdateTweet(updateStatus);
  };

  return (
    <Wrapper>
      <PostTweetForm updateTweet={updateTweet} />
      <Timeline handleUpdate={handleUpdate} />
    </Wrapper>
  );
}
