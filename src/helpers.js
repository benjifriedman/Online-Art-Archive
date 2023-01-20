export const removeFileExt = (name) => {
  // rename name without file extension
  if (name.includes('.png')) {
    name = name.split('.png')[0]
  } else if (name.includes('.jpg')) {
    name = name.split('.jpg')[0]
  } else if (name.includes('.jpeg')) {
    name = name.split('.jpeg')[0]
  } else if (name.includes('.heic')) {
    name = name.split('.heic')[0]
  }

  return name
}
