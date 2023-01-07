import React from 'react'
import PostCard from './PostCard'
import styled from 'styled-components'
import Anim from './Anim'

const List = styled.div`
  @media (min-width: 600px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`

const removeFileExt = (name) => {
  // rename name without file extension
  if (name.includes('.png')) {
    name = name.split('.png')[0]
  } else if (name.includes('.jpg')) {
    name = name.split('.jpg')[0]
  } else if ((name = name.split('.jpeg')[0])) {
    name = name.split('.jpeg')[0]
  }

  return name
}

const PostList = ({ posts, singleFilePages }) => {
  return (
    <>
      <section>
        {/* <Anim>
          <h2>Online Art Archive</h2>
        </Anim> */}

        <List>
          {posts.map(({ node }, index) => {
            const postLink = singleFilePages
              ? `${node.fields.slug}/${removeFileExt(node.name)}`
              : node.fields.slug
            return <PostCard key={index} post={node} postLink={postLink} />
          })}
        </List>
      </section>
    </>
  )
}

export default PostList
