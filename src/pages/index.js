import React from 'react'
import SeriesList from '../components/SeriesList'
import PostList from '../components/PostList'
import Layout from '../components/layout'
import { graphql, Link } from 'gatsby'
import SEO from '../components/Seo'

const Index = ({ data }) => {
  const response = data

  // const posts = response?.allMdx?.edges
  const series = response?.allDriveFolderNode?.edges
  const posts = response?.allDriveFileNode?.edges
  const singleFilePages = response.site?.siteMetadata?.singleFilePages

  return (
    <Layout>
      {/* <h2>
        <Link to="/oar">Oar</Link>
      </h2> */}
      <SeriesList posts={series} singleFilePages={singleFilePages} />
      <PostList posts={posts} singleFilePages={singleFilePages} />
    </Layout>
  )
}

export default Index

export const Head = ({ data }) => {
  const { title, image } = data.site.siteMetadata

  return <SEO title={title} image={image} />
}

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            slug
            date(formatString: "MMMM Do, YYYY")
            author
            image {
              childImageSharp {
                gatsbyImageData(
                  width: 600
                  placeholder: BLURRED
                  formats: [AUTO, WEBP]
                )
              }
            }
          }
          excerpt
        }
      }
    }
    allDriveFileNode {
      edges {
        node {
          name
          fields {
            slug
          }
          webContentLink
        }
      }
    }
    allDriveFolderNode {
      edges {
        node {
          name
        }
      }
    }
    site {
      siteMetadata {
        title
        image
        singleFilePages
      }
    }
  }
`
