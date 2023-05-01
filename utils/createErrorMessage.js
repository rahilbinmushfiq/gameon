// Function that returns an error message based on the provided Firebase Authentication error object
export default function createErrorMessage(error) {
  switch (error.code) {
    case 'auth/weak-password':
      return "The password must be at least 6 characters long.";
    case 'auth/wrong-password':
      return "The password is incorrect.";
    case 'auth/popup-blocked':
      return "Sign in unsuccessful: The popup window was blocked by the browser.";
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return "Sign in unsuccessful: The popup window was closed before completing the sign-in process.";
    case 'auth/network-request-failed':
      return "A network error occurred. Please try again.";
    case 'auth/user-disabled':
      return "This user account has been disabled.";
    case 'auth/internal-error':
      return "An internal error occured in the server. Please try again";
    case 'auth/account-exists-with-different-credential':
      return "Sign in unsuccessful: There is already an account associated with the same email address.";
    case 'auth/user-not-found':
      return "There is no user corresponding to the email address provided.";
    case 'auth/email-already-in-use':
      return "The email address is already in use by another account.";
    case 'auth/invalid-email':
      return "The email address is not valid.";
    default:
      return "An error has occurred. Please try again.";
  }
}
