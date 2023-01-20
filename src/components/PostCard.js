import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'
import styled from 'styled-components'
import Anim from './Anim'

const Card = styled.article`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  // &:hover {
  //   .card-image {
  //     transform: scale(1.025);
  //   }
  }

  a {
    text-decoration: none;
    color: var(--dark);
  }
  .card-image {
    height: 500px;
    transition: transform 0.15s;
    margin-bottom: 15px;
  }

  @media (min-width: 600px) {
    flex: 0 0 46%;
  }
`

const Meta = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
`

const PostCard = ({ post, postLink }) => {
  // const { title, date, author, slug } = post.frontmatter
  // const img = post.frontmatter.image.childImageSharp.gatsbyImageData
  const { name, webContentLink } = post

  return (
    <Card style={{ marginBottom: '0px', padding: 10 }}>
      <Anim>
        <Link to={postLink}>
          <img
            src={webContentLink}
            alt={name}
            loading="lazy"
            className="card-image"
          />
          {/* <GatsbyImage image={img} alt={title} className="card-image" /> */}
          {/* <h2>{name}</h2> */}
          {/* <p>{post.excerpt}</p> */}
          {/* <Meta>
            <h4>Written by {author}</h4>
            <h4>Posted on {date}</h4>
            <div className="btn">Read Article</div>
          </Meta> */}
        </Link>
      </Anim>
    </Card>
  )
}

export default PostCard
