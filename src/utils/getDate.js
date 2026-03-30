export const getDate = (date) => {

    return new Date(date * 1000).toLocaleDateString()
}