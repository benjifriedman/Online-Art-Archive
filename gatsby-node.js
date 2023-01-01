exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const {
    data: {
      allMdx: { edges: posts },
    },
  } = await graphql(`
    {
      allMdx {
        edges {
          node {
            frontmatter {
              title
              slug
            }
          }
        }
      }
    }
  `)

  posts.forEach(({ node }) => {
    const { slug, title } = node.frontmatter
    if (!title) return

    createPage({
      path: slug,
      component: require.resolve("./src/templates/post-template.js"),
      context: {
        title: title,
        slug: slug,
      },
    })
  })
}
