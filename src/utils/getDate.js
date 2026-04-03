export const getDate = (timestamp) => {
    if (!timestamp) return 'Невідома дата'

    let dateObj;

    if (typeof timestamp.toDate === 'function') {
        dateObj = timestamp.toDate()
    }

    else if (timestamp.seconds) {
        dateObj = new Date(timestamp.seconds * 1000)
    }

    else {
        dateObj = new Date(timestamp)
    }


    if (isNaN(dateObj.getTime())) {
        return 'Невідома дата'
    }

    return new Intl.DateTimeFormat('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj)
}