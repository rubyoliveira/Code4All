import { useState } from 'react'
import { Link } from 'react-router-dom';


function Header() {

  return (
    <>
    <div className = "navbar-logo-center">
        <div data animation = "default" data-collapse = "medium" data-duration = "400" data-easing = "ease" data-easing2 = "ease" role= "banner" className = "navbar-logo-center-container shadow-three w-nav">
            <div className = "container">
                <div className = "navbar-wrapper-three">
                    <nav role = "navigation" className = "nav-menu-wrapper-three w-nav-menu">
                        <div className = "nav-menu-three">
                        <div>
                            <Link to = "/courses/create">
                                <button className="button-primary w-button" >Create Course</button>
                            </Link>
                        </div>
                        <Link to = "/courses">
                            <img src = "https://daks2k3a4ib2z.cloudfront.net/667c827c7c186db9a3b13906/667c88e2e51a529772f7aa66_cute-long-haired-dachshund-dog-black-tan-cartoon-vector-illustration_42750-1051%20copy-p-130x130q80.jpeg" loading= "lazy" width= "74" alt =""></img>
                        </Link>
                        <div className="mobile-margin-top-10">
                            <button className="button-primary w-button">Profile</button>
                        </div>
                        </div>
                    </nav>
                    <div className = "menu-button w-nav-button">
                        <div className= "w-icon-nav-menu"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Header
