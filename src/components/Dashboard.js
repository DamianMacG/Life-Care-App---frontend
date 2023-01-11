import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import ClientList from "./ClientList";


const Dashboard = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = process.env.REACT_APP_DOMAIN;

      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();

        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="container">
                <span id="nav">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </span>
        <div className="profilePicture">
        </div>
        <div className="userInfo">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className="metadata">
          <h3>User Metadata</h3>
          {userMetadata ? (
            <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
          ) : (
            "{navbar-quote: I AM A Navbar}"
          )}
          <ClientList/>
        </div>
      </div>
    )
  );
};

export default Dashboard;
