import "./home.css"
import { useNavigate } from "react-router"
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/register");
  }

  const handleLogInClick = () => {
    navigate("/login");
  }

  useEffect(() => {
    const particles = document.querySelectorAll(".particle");
    particles.forEach((p) => {
      const particle = p as HTMLElement;
      const randomTop = Math.random() * 100;
      const randomLeft = Math.random() * 100;
      particle.style.top = `${randomTop}%`;
      particle.style.left = `${randomLeft}%`;
    });
  }, []);

  return (
    <div className="d-flex flex-column wrapper">
      <div className="overlay">
      <div className="particles-container">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
        <div className="hero-content">
          <h1>
            Chatter is the new standard <br /><span className="gradient-text">for online communication.</span>
          </h1>
          <p className="subtitle">Chat, call, and video conference with ease.</p>
           <div className="action-buttons">
            <button className="button" onClick={handleSignUpClick}>
              <span className="text">Sign Up</span>
            </button>
            <button className="button" onClick={handleLogInClick}>
              <span className="text">Log In</span>
            </button>
          </div>
          <img src="src/assets/chatScreenshot2.png" className="hero-img" />
        </div>
      </div>
    </div>
  )
}

export default Home
