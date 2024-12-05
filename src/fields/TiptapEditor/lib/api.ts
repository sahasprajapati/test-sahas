export class API {
  public static uploadImage = async (fileList: FileList | File[]): Promise<string> => {
    const files: File[] = []

    if ((fileList as FileList)?.item) {
      for (let i = 0; i < fileList.length; i += 1) {
        const item = (fileList as FileList).item(i)
        if (item) {
          files.push(item)
        }
      }
    }

    if (files.some((file) => file.type.indexOf('image') === -1)) {
      return ''
    }

    const filteredFiles = files.filter((f) => f.type.indexOf('image') !== -1)

    const file = filteredFiles.length > 0 ? filteredFiles[0] : undefined

    if (!file) return ''
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }
}

export default API
