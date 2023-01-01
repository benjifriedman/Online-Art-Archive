import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import styled from "styled-components"
import PropTypes from "prop-types"

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
`

const PostTemplate = ({ pageContext, data, children }) => {
  const { title, date, author, image } = data.mdx.frontmatter
  const img = getImage(image)

  return (
    <Layout>
      <PostTemplateStyles>
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
            gatsbyImageData(layout: FULL_WIDTH, formats: [AUTO, WEBP])
          }
        }
      }
    }
  }
`

export default PostTemplate

PostTemplate.propTypes = {
  pageContext: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    image: PropTypes.object,
  }),
}
