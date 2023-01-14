const {
  createFilePath,
  createRemoteFileNode,
} = require('gatsby-source-filesystem')
const { loadDrive, getFolder, getFiles, getAuth } = require('./google-drive')
const path = require(`path`)
const crypto = require(`crypto`)
const createPaginatedPages = require('gatsby-paginate')

// constants for your GraphQL Post and Author types
const POST_NODE_TYPE = `DriveNode`
const FOLDER = `application/vnd.google-apps.folder`
const GOOGLE_DOC = 'application/vnd.google-apps.document'

const creds = {
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
  key: process.env.GOOGLE_PRIVATE_KEY,
  service_email: process.env.GOOGLE_CLIENT_EMAIL,
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type DriveFileNode implements Node @dontInfer {
      id: ID!
      name: String!
      parent: String!
      children: [String!]
      url: String!
      createdTime: Date!
      webContentLink: String!
      fields: Field!
    }
    type Field {
      slug: String!
    }
    type DriveFolderNode implements Node @dontInfer {
      id: ID!
      name: String!
      parent: String!
      children: [String!]
      url: String!
      createdTime: Date!
      slug: String!
    }
  `

  createTypes(typeDefs)
}

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId, getNodesByType },
  options
) => {
  console.log('Sourcing Google drive nodes...')
  const { createNode, touchNode, deleteNode } = actions

  // load drive api client
  const drive = await loadDrive(creds)
  const cmsFiles = await getFolder(drive, creds.folderId)
  const parent = ''
  const parentId = '__SOURCE__'

  // Start downloading recursively through all folders.
  console.time(`Searching Google drive content...`)
  await recursiveFoldersAndFiles(
    cmsFiles,
    parent,
    drive,
    createNode,
    createNodeId,
    parentId
  )
}

function createFileNode({ createNode, createNodeId, file, parentId }) {
  // create node for the file
  const fileId = createNodeId(`drive-file-${file.id}`)
  const fileContent = JSON.stringify(file)
  const fileContentDigest = crypto
    .createHash('md5')
    .update(fileContent)
    .digest('hex')
  const { webContentLink, createdTime } = file

  const fileNode = Object.assign({}, file, {
    id: fileId,
    name: file.name,
    parent: parentId || null,
    children: [],
    url: webContentLink,
    createdTime,
    internal: {
      type: `DriveFileNode`,
      mediaType: file.mimeType,
      content: fileContent,
      contentDigest: fileContentDigest,
    },
  })

  createNode(fileNode)
}

function createFolderNode({ createNode, createNodeId, file, parentId, path }) {
  const folderId = createNodeId(`drive-folder-${file.id}`)
  const folderContent = JSON.stringify(file)
  const folderContentDigest = crypto
    .createHash('md5')
    .update(folderContent)
    .digest('hex')

  const { webContentLink, createdTime } = file
  const folderNode = Object.assign({}, file, {
    id: folderId,
    name: file.name,
    parent: parentId,
    children: [],
    url: webContentLink?.split('&')[0] || 'not found',
    createdTime,
    slug: path,
    internal: {
      type: `DriveFolderNode`,
      mediaType: file.mimeType,
      content: folderContent,
      contentDigest: folderContentDigest,
    },
  })

  createNode(folderNode)

  return folderId
}

exports.onCreateNode = ({
  node,
  cache,
  actions,
  store,
  createNodeId,
  getNode,
}) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === `DriveFileNode`) {
    const parent = getNode(node.parent)
    const { slug } = parent

    try {
      createNodeField({
        node,
        name: 'slug',
        value: slug,
      })
    } catch (e) {
      console.log(`Error creating remote file`, e)
    }
  }
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const {
    data: {
      allMdx: { edges: posts },
      allDriveFolderNode: { edges: driveFolders },
      allDriveFileNode: { edges: driveFiles },
      site: {
        siteMetadata: { singleFilePages },
      },
    },
  } = await graphql(`
    {
      site {
        siteMetadata {
          singleFilePages
        }
      }
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
      allDriveFolderNode {
        edges {
          node {
            name
            slug
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
          }
        }
      }
    }
  `)

  const driveData = { driveFolders, driveFiles }

  createDrivePages(
    driveData,
    (page) => {
      createPaginatedPages({
        edges: driveFiles,
        createPage: createPage,
        pageTemplate: './src/templates/index.js',
        pageLength: 1,
        pathPrefix: '',
        context: {},
      })
      createPage(page)
    },
    singleFilePages
  )
  createMDXPages(posts, (page) => {
    createPage(page)
  })
}

function createMDXPages(mdxNodes, cb) {
  mdxNodes.forEach(({ node }) => {
    const { slug, title } = node.frontmatter
    if (!title) return

    const page = {
      path: slug,
      component: require.resolve('./src/templates/post-template.js'),
      context: {
        title: title,
        slug: slug,
      },
    }

    cb(page)
  })
}

function createDrivePages(driveData, cb, singleFilePages) {
  const { driveFolders, driveFiles } = driveData

  driveFolders.forEach(({ node }) => {
    const { name, slug } = node
    const page = {
      path: slug,
      component: require.resolve('./src/templates/post-template.js'),
      context: {
        title: name,
        slug,
      },
    }
    cb(page)
  })

  if (singleFilePages) {
    driveFiles.forEach(({ node }) => {
      const {
        name,
        fields: { slug },
      } = node
      let imagePath = name

      // rename name without file extension
      name.includes('.png') ? (imagePath = name.split('.png')[0]) : ''
      name.includes('.jpg') ? (imagePath = name.split('.jpg')[0]) : ''
      name.includes('.jpeg') ? (imagePath = name.split('.jpeg')[0]) : ''

      const page = {
        path: `${slug}/${imagePath}`,
        component: require.resolve('./src/templates/post-template.js'),
        context: {
          title: name,
          slug,
          filePath: `${slug}/${imagePath}`,
        },
      }
      cb(page)
    })
  }
}

const recursiveFoldersAndFiles = async (
  array,
  parent = '',
  drive,
  createNode,
  createNodeId,
  parentId
) => {
  // make files iterable
  if (array && !array.length) {
    array = [array]
  } else {
    array = array || []
  }

  // loop through the files
  for (let file of array) {
    // check the mimetype if it's a folder
    if (file.mimeType === FOLDER) {
      // if it's a folder, create the path
      const folderPath = parent === '' ? file.name : `${parent}/${file.name}`

      // create the folder node
      const newParentId = createFolderNode({
        createNode,
        createNodeId,
        file,
        parentId,
        path: folderPath,
      })

      // Then, get the files inside and run the function again
      let files = await getFolder(drive, file.id)

      await recursiveFoldersAndFiles(
        files,
        folderPath, // set the new parent
        drive,
        createNode,
        createNodeId,
        newParentId
      )
    } else if (
      file.mimeType === 'image/png' ||
      file.mimeType === 'image/jpeg' ||
      file.mimeType === 'image/jpg'
    ) {
      // if it's a file, create a path referencing the parent folder
      const filePath = parent === '' ? file.name : `${parent}/${file.name}`

      // create image nodes
      createFileNode({ createNode, createNodeId, file, parentId })
    }
  }
}
