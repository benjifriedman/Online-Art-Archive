import React from 'react'
import { Link, graphql, navigate } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import SEO from '../components/Seo'

const PostTemplateStyles = styled.section`
  h1,
  h2 {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }

  .post__body {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }
  .gatsby-resp-image-img {
    width: 100%;
  }
`

const renderDriveAssets = (edges, children, singleFilePages, title) => {
  let driveAssets = edges
  if (singleFilePages) {
    driveAssets = edges.filter((edge) => edge.node.name === title)
  }

  return (
    <>
      {driveAssets.map((edge) => {
        const { name, webContentLink, createdTime, id } = edge.node
        const date = new Date(createdTime).toDateString()

        return (
          <div key={id}>
            {/* <hr
              style={{ marginTop: 0 }}
              className="separator separator__large"
            />
            <Link className="btn" to="/">
              Back to all posts
            </Link>
            <hr className="separator" />
            <h1>{name}</h1> */}

            <img
              className="gatsby-resp-image-img"
              src={webContentLink}
              alt={name}
            />

            {/* <div className="post__body">{children}</div>
            <hr className="separator" />
            <h2>
              Posted on <span>{date}</span>
            </h2>
            <hr className="separator separator__large" /> */}
          </div>
        )
      })}
    </>
  )
}

const renderFullPost = ({ title, date, author, image }, children) => {
  const img = getImage(image)

  return (
    <>
      <hr style={{ marginTop: 0 }} className="separator separator__large" />
      <Link className="btn" to="/">
        Back to all posts
      </Link>
      <hr className="separator" />
      <h1>{title}</h1>
      <h2>
        <span>Written by {author}</span> & Posted on <span>{date}</span>
      </h2>

      <GatsbyImage image={img} alt="Blog Post" />

      <div className="post__body">{children}</div>
      <hr className="separator" />
      <h2>
        Posted on <span>{date}</span>
      </h2>
      <hr className="separator separator__large" />
    </>
  )
}

const PostTemplate = ({ pageContext, data, children }) => {
  const {
    site: {
      siteMetadata: { singleFilePages },
    },
  } = data
  const { title } = pageContext
  return (
    <Layout>
      <PostTemplateStyles>
        {data?.mdx?.frontmatter
          ? renderFullPost(data.mdx.frontmatter, children)
          : ''}
        {data?.allDriveFileNode?.edges.length > 0
          ? renderDriveAssets(
              data?.allDriveFileNode?.edges,
              children,
              singleFilePages,
              title
            )
          : !data?.mdx?.frontmatter && navigate('/')}
      </PostTemplateStyles>
    </Layout>
  )
}

export const query = graphql`
  query getPost($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title
        slug
        date(formatString: "MMMM Do, YYYY")
        author
        image {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH, formats: [AUTO, WEBP, PNG])
          }
        }
      }
    }
    allDriveFileNode(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          id
          name
          webContentLink
          createdTime
          fields {
            slug
          }
        }
      }
    }
    site {
      siteMetadata {
        singleFilePages
      }
    }
  }
`

export default PostTemplate

export const Head = ({ data }) => {
  const { title, image } = data.site.siteMetadata

  return <SEO title={title} image={image} />
}

PostTemplate.propTypes = {
  pageContext: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    filePath: PropTypes.string,
  }),
  data: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    image: PropTypes.object,
  }),
}
