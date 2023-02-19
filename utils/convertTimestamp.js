export const getDateAndTime = (timestamp) => {
    let dateAndTime = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    return dateAndTime;
}

export const getDate = (timestamp) => {
    let date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return date;
}

export const getYear = (timestamp) => {
    let year = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleDateString('en-US', {
        year: 'numeric'
    });

    return year;
}

export const timestampConversion = (timestamp) => {
    let date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    return date;
}