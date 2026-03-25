const imageTech = import.meta.glob('/src/assets/images/catalog/*.{png,jpg,jpeg,svg}', { eager: true })

const findImage = (imageCollection, imageName) => {
    if (!imageName) return null

    for (const path in imageCollection) {

        const fileNameWithExt = path.split('/').pop()
        const exactFileName = fileNameWithExt.split('.')[0]

        if (fileNameWithExt === imageName || exactFileName === imageName) {
            return imageCollection[path].default
        }
    }

    return null
}

export const getImage = (imageName) => findImage(imageTech, imageName)