import React from 'react'
import PostCard from './PostCard'
import styled from 'styled-components'
import Anim from './Anim'
import { Link, navigate } from 'gatsby'
import { removeFileExt } from '../helpers'
import Pagination from 'react-bootstrap/Pagination'

const List = styled.div`
   {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`
const PostList = ({ posts, pagination, singleFilePages }) => {
  const { group, index, pageCount } = pagination
  const previousUrl = index - 1 === 0 ? '/' : (index - 1).toString()
  const nextUrl = (index + 1).toString()

  // build pages index
  const pages = []
  let addedEllipsis = false
  for (let p = 1; p < pageCount + 1; p++) {
    if (p > 5 && p < pageCount - 1) {
      !addedEllipsis &&
        pages.push(<Pagination.Ellipsis key={p} href={`/${p.toString()}`} />)
      addedEllipsis = true
    } else {
      pages.push(
        <Pagination.Item
          key={p}
          className="blogListing"
          active={index === p}
          href={p === 1 ? '/' : `/${p.toString()}`}
        >
          {p}
        </Pagination.Item>
      )
    }
  }

  return (
    <>
      <section>
        {/* <Anim>
          <h2>Online Art Archive</h2>
        </Anim> */}

        <List>
          {posts.map(({ node }, i) => {
            const postLink = singleFilePages
              ? `/${node.fields.slug}/${removeFileExt(node.name)}`
              : `${node.fields.slug}`
            return <PostCard key={i} post={node} postLink={postLink} />
          })}
        </List>
        <Pagination size="sm" className="col-md-5 mx-auto mt-3">
          {index === 1 ? (
            ''
          ) : (
            <Pagination.Prev href={index === 2 ? `/` : `/${previousUrl}`} />
          )}
          {pages}
          {group[index - 1] ? (
            <Pagination.Next onClick={() => navigate(`/${nextUrl}`)} />
          ) : (
            // I know this is hacky, sorry
            <Pagination.Next onClick={() => navigate(`/${nextUrl}`)} />
          )}
        </Pagination>
      </section>
    </>
  )
}

export default PostList
