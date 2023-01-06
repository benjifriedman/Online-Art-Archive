const {
  createFilePath,
  createRemoteFileNode,
} = require('gatsby-source-filesystem')
const { loadDrive, getFolder, getFiles, getAuth } = require('./google-drive')
const path = require(`path`)
const crypto = require(`crypto`)

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
  console.time(`Searching Google drive content...`, cmsFiles)
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
      allDriveFolderNode {
        edges {
          node {
            name
            slug
          }
        }
      }
    }
  `)

  createDrivePages(driveFolders, createPage)
  createMDXPages(posts, createPage)
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

function createDrivePages(driveNodes, cb) {
  driveNodes.forEach(({ node }) => {
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
      console.log(`Creating folder path at ${parent}/${file.name}`)
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
      console.log(`Setting new parent at ${parent}/${file.name}`)
      console.log(`Recrusively searching in folder...`)

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
      console.log(`Creating image file path at ${parent}/${file.name}`)
      const filePath = parent === '' ? file.name : `${parent}/${file.name}`

      // create image nodes
      createFileNode({ createNode, createNodeId, file, parentId })
    }
  }
}
