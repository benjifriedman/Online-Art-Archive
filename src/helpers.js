export const removeFileExt = (name) => {
  // rename name without file extension
  if (name.includes('.png')) {
    name = name.split('.png')[0]
  } else if (name.includes('.jpg')) {
    name = name.split('.jpg')[0]
  } else if ((name = name.split('.jpeg')[0])) {
    name = name.split('.jpeg')[0]
  }

  return name
}
