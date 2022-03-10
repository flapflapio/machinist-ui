import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";

const Profile = () => {
  const { user, signOut, route } = useAuthenticator((context) => [
    context.user,
    context.route,
  ]);

  return route === "authenticated" ? (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </div>
  ) : (
    <Authenticator />
  );
};

export default Profile;
