import { useState } from 'react'
import './Home.css'
import SignUpModal from "./user-handling/SignUpModal.jsx"
import LoginModal from "./user-handling/LoginModal.jsx"
import Footer from "../../components/Footer.jsx"

function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignUp]= useState(false);

  const displaySignUp = () => setOpenSignUp(true);
  const handleSignUpClose = () => setOpenSignUp(false);

  const displayLogin = () => setOpenLogin(true);
  const handleLoginClose = () => setOpenLogin(false);

  return (
    <div className = "homepage-header">
      <div className="navbar-logo-left">
      <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar-logo-left-container shadow-three w-nav">
        <div className="navbar-wrapper"><img src="https://daks2k3a4ib2z.cloudfront.net/667c827c7c186db9a3b13906/667c88e2e51a529772f7aa66_cute-long-haired-dachshund-dog-black-tan-cartoon-vector-illustration_42750-1051%20copy-p-130x130q80.jpeg" loading="lazy" width="59" alt=""></img>
          <nav role="navigation" className="nav-menu-wrapper w-nav-menu">
            <div role="list" className="nav-menu-two w-list-unstyled">
              <div>
                <button className="nav-link-accent" onClick = {displaySignUp}>Sign up</button>
              </div>
              <div className="mobile-margin-top-10">
                <button className="button-primary w-button" onClick = {displayLogin}>LOG IN</button>
              </div>
            </div>
          </nav>
          <div className="menu-button w-nav-button">
            <div className="w-icon-nav-menu"></div>
          </div>
        </div>
        <div className="container-2"></div>
      </div>
    </div>
    <div className="section height-vw90 cc-gray">
      <div className="container cc-flex-v">
        <h1 className="hero-title">Code 4 All.</h1>
        <div className="hero-sub">Ready to learn and have fun?</div>
      </div>
    </div>
    <div className="section cc-no-padding-bottom">
      <div className="container cc-flex-h">
        <div className="col-left">
          <div className="learn_wrapper">
            <h3>Our Mission.</h3>
            <div className="text_left">We aim to empower individuals from diverse backgrounds by offering them the opportunity to discover how amazing coding is!</div>
          </div>
        </div>
        <div className="col-right">
          <div data-w-id="ae48e6c0-d717-9092-9ba5-7e187503412f" className="block-wrapper">
            <div tabIndex="0" className="block _1">
              <div className="div-block">
                <div className="block-title">01</div>
                <div className="block-text">Explore a variety of courses designed to help you learn new languages and gain valuable skills.</div>
              </div>
            </div>
            <div tabIndex="0" className="block _2">
              <div className="div-block">
                <div className="block-title">02</div>
                <div className="block-text">Explore and enjoy an engaging learning experience while earning cute badges as you progress.</div>
              </div>
            </div>
            <div tabIndex="0" className="block _3">
              <div className="div-block">
                <div className="block-title">03</div>
                <div className="block-text">We hope this resource sparks your interest in learning how fun coding can be.We believe that this valuable resource will inspire you to explore the exciting and engaging world of coding.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="section halfheight cc-end">
      <div className="container cc-flex-h">
        <h1 className="hero-title">Explore free coding tutorials and experience the joy of learning.</h1>
      </div>
    </div>
    <Footer/>
   {openSignup && <SignUpModal closeModal = {handleSignUpClose} />}
   {openLogin && <LoginModal closeModal = {handleLoginClose} />}
  </div>
  )
}

export default Home
