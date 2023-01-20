const path = require('path')
const { google } = require('googleapis')
const axios = require('axios')
const fs = require('fs')

// Get auth token
const getAuth = ({ email, key }) => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: key,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
}

/**
 * Lists the names and IDs of up to 10 files.
 */
async function loadDrive(options) {
  const { key, service_email } = options
  const auth = await getAuth({ email: service_email, key })

  google.options({ auth: auth })

  return google.drive('v3')
}

const getFolder = async (drive, folderId) => {
  try {
    const res = await drive.files.list({
      pageSize: 10,
      fields:
        'nextPageToken, files(id, name, mimeType, webContentLink, webViewLink, createdTime)',
      q: `'${folderId}' in parents`,
    })

    const files = res.data.files
    if (files.length === 0) {
      console.log('No files found.')
    } else {
      console.log(files.length, 'files found')
      return files
    }
  } catch (e) {
    console.log(e)
  }
}

const getFile = async (drive, fileId, dest) => {
  try {
    const res = await drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    )
    if (dest) {
      // write the file
      const stream = fs.createWriteStream(dest)
      return new Promise((resolve, reject) => {
        res.data
          .on('end', () => {
            resolve(res)
          })
          .on('error', (err) => {
            reject(err)
          })
          .pipe(stream)
      })
    } else {
      return res
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getAuth,
  getFolder,
  getFile,
  loadDrive,
}
