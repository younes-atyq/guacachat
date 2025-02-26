import Nav from "../components/Nav";
import setUserOffline from "../helpers/setUserOffline";

const Profile = () => {
  // Set the user state
  setUserOffline();
  return (
    <div id="profile" className="container">
      <Nav pageName="profile" />
    </div>
  );
};

export default Profile;
