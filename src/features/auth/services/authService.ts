import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchUserAttributes as fetchAmplifyUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

export const handleSignUp = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const { nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
        },
      },
    });
    return { success: true, nextStep };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const handleConfirmSignUp = async (email: string, code: string) => {
  try {
    const { isSignUpComplete } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    return { success: true, isSignUpComplete };
  } catch (error) {
    console.error("Error confirming sign up:", error);
    throw error;
  }
};

export const handleSignIn = async (email: string, password: string) => {
  try {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });
    return { success: true, isSignedIn, nextStep };
  } catch (error) {
    // Cognito throws UserAlreadyAuthenticatedException when a stale local session
    // wasn't fully cleared (e.g. a previous sign-out failed mid-flight). Clear it
    // locally and retry once so the user isn't stuck on the login screen.
    if (error instanceof Error && error.name === 'UserAlreadyAuthenticatedException') {
      await signOut().catch(() => undefined);
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      return { success: true, isSignedIn, nextStep };
    }
    console.error("Error signing in:", error);
    throw error;
  }
};

export const fetchUserAttributes = async () => {
  try {
    return await fetchAmplifyUserAttributes();
  } catch (error) {
    console.error("Error fetching user attributes:", error);
    throw error;
  }
};

export const getUserSession = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens ? session : null;
  } catch {
    return null;
  }
};

export const handleSignOut = async () => {
  try {
    await signOut();
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
