import React from 'react'
import SeriesList from '../components/SeriesList'
import PostList from '../components/PostList'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import Seo from '../components/Seo'
import MarkdownIt from 'markdown-it'

const Index = ({ data, pageContext }) => {
  const response = data
  const { group } = pageContext

  // markdown parser
  const md = new MarkdownIt()

  // const posts = response?.allMdx?.edges
  const series = response?.allDriveFolderNode?.edges
  const posts = response?.allDriveFileNode?.edges
  const images = response?.allFile?.edges
  const singleFilePages = response.site?.siteMetadata?.singleFilePages
  const mdFiles = posts.filter((post) => {
    return post.node.mdFileData !== ''
  })

  return (
    <Layout>
      <SeriesList series={series} />
      <div>
        <ul>
          {mdFiles.map((mdFile, i) => {
            const html = md.render(mdFile.node.mdFileData)
            return <li key={i} dangerouslySetInnerHTML={{ __html: html }}></li>
          })}
        </ul>
      </div>
      <PostList
        posts={group}
        images={images}
        pagination={pageContext}
        singleFilePages={singleFilePages}
      />
    </Layout>
  )
}

export default Index
export const Head = ({ data }) => {
  const { title, image } = data.site.siteMetadata
  return <Seo title={title} image={image} />
}

// https://www.gatsbyjs.com/docs/graphql-reference/#complete-list-of-possible-operators
export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }, limit: 10) {
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
    allDriveFileNode(limit: 4) {
      edges {
        node {
          name
          fields {
            slug
          }
          webContentLink
          mdFileData
        }
      }
    }
    allDriveFolderNode {
      edges {
        node {
          name
          slug
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
