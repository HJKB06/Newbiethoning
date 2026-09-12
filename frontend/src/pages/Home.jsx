function Home() {
  return (
    <div className="landing-page">

      <nav className="navbar">
        <h2 className="logo">LifeFit</h2>

        <div className="nav-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </nav>

      <section className="hero-section">

        <h1>Find a house that fits your life.</h1>

        <p>
          Choosing a home is more than just finding the cheapest option.
          LifeFit learns about your lifestyle, budget, location preferences,
          and priorities to help you discover homes that suit you.
        </p>

        <button className="start-btn">
          Take the LifeFit Test
        </button>

      </section>

    </div>
  )
}

export default Home