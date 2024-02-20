import Nav from "../components/Nav";

function Home() {
  return (
    <div id="home" className="container">
      <Nav pageName="home" />
      <div className="text">
        <h1>Welcome to the chat room of the future</h1>
        <p>
          Where conversations flow freely and connections are made in real-time,
          embracing the digital age with open arms to engage in discussions that
          transcend borders and time zones, fostering friendships and sharing
          ideas without boundaries.
        </p>
      </div>
      <a href="#a">StepIn</a>
    </div>
  );
}

export default Home;
