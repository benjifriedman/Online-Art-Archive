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
    margin-top: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .gatsby-resp-image-img {
    width: 100%;
    margin-bottom: 20px;
  }
`

const renderDriveAssets = (data, children, singleFilePages, title) => {
  let driveAssets = data.allDriveFileNode.edges
  if (singleFilePages) {
    driveAssets = data.allDriveFileNode?.edges.filter(
      (edge) => edge.node.name === title
    )
  }

  return (
    <>
      {driveAssets.map((edge, i) => {
        let imgSrc, altName
        if (edge.node.name.includes('.heic')) {
          const { name, publicURL } = data.allFile.edges[0].node
          altName = name
          imgSrc = publicURL
        } else {
          const { name, webContentLink, createdTime, id } = edge.node
          const date = new Date(createdTime).toDateString()
          altName = name
          imgSrc = webContentLink
        }

        return (
          <div key={i}>
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
              src={imgSrc}
              alt={altName}
              loading="lazy"
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
  let content = ''

  if (data?.allDriveFileNode?.edges.length > 0) {
    content = renderDriveAssets(data, children, singleFilePages, title)
  } else if (data?.mdx?.frontmatter) {
    content = renderFullPost(data.mdx.frontmatter, children)
  } else {
    navigate('/')
  }

  return (
    <Layout>
      <PostTemplateStyles>{content}</PostTemplateStyles>
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
    allFile(filter: { relativePath: { regex: "/heic/" } }) {
      edges {
        node {
          name
          relativePath
          publicURL
        }
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
