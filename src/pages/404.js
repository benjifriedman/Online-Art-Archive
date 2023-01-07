import React from 'react'
import { Link } from 'gatsby'
import SEO from '../components/Seo'
import { graphql } from 'gatsby'

const Error = () => {
  return (
    <>
      <h1>This page has disappeared</h1>
      <Link className="btn" to="/">
        Return Home
      </Link>
    </>
  )
}

export default Error

export const Head = ({ data }) => {
  const { title, image } = data.site.siteMetadata

  return <SEO title={title} image={image} />
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        image
        singleFilePages
      }
    }
  }
`
