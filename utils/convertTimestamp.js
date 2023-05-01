// This file contains utility functions for working with Firestore and Unix timestamps


// Converts a Firestore timestamp to a formatted date and time string
export const getDateAndTime = (timestamp) => {
  let dateAndTime = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  return dateAndTime;
};

// Converts a Firestore timestamp to a formatted date string
export const getDate = (timestamp) => {
  let date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return date;
};

// Converts a Firestore timestamp to a formatted year string
export const getYear = (timestamp) => {
  let year = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleDateString('en-US', {
    year: 'numeric'
  });

  return year;
};

// Converts a Firestore timestamp to a JavaScript Date object
export const timestampConversion = (timestamp) => {
  let date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

  return date;
};

// Converts a Unix timestamp (in milliseconds) to a formatted date string
export const getRegistrationDate = (createdAt) => {
  let date = new Date(parseInt(createdAt)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: "numeric"
  });

  return date;
};
