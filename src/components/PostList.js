import React from "react"
import PostCard from "./PostCard"
import styled from "styled-components"
import Anim from "./Anim"

const List = styled.div`
  @media (min-width: 600px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`

const PostList = ({ posts }) => {
  return (
    <>
      <section>
        {/* <Anim>
          <h2>Online Art Archive</h2>
        </Anim> */}

        <List>
          {posts.map(({ node }, index) => {
            return <PostCard key={index} post={node} />
          })}
        </List>
      </section>
    </>
  )
}

export default PostList
