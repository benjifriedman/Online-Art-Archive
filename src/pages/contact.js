import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/Seo'
import { graphql } from 'gatsby'

const ContactPage = () => {
  return (
    <>
      <Layout>
        <h1>Get in touch</h1>
        <p>Contact page</p>
      </Layout>
    </>
  )
}

export default ContactPage

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
