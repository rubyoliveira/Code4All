import { useState } from 'react'

function Footer() {
  const openInNewTab = async (url) => {
    window.open(url, '_blank');
  }

  return (
    <>
        <section className="footer-dark">
        <div className="container-2">
            <div className="footer-wrapper">
            <a href="#" className="footer-brand w-inline-block"><img src="https://daks2k3a4ib2z.cloudfront.net/667c827c7c186db9a3b13906/667c88e2e51a529772f7aa66_cute-long-haired-dachshund-dog-black-tan-cartoon-vector-illustration_42750-1051%20copy-p-130x130q80.jpeg" loading="lazy" width="59" alt=""></img></a>
            <div id="w-node-ba39d60b-38e8-ad20-6a84-90703745e087-a3b1394d" className="footer-block">
                <div className="title-small">Connect</div>
                <div className="footer-social-block">
                <a onClick = {() => openInNewTab("https://www.linkedin.com/in/ruby-oliveira/")}className="footer-social-link w-inline-block"><img src="https://uploads-ssl.webflow.com/62434fa732124a0fb112aab4/62434fa732124a389912aad8_linkedin%20small.svg" loading="lazy" alt=""></img></a>
                <a onClick = {() => openInNewTab("https://www.facebook.com/profile.php?id=100078275122689")} className="footer-social-link w-inline-block"><img src="https://uploads-ssl.webflow.com/62434fa732124a0fb112aab4/62434fa732124a51bf12aae9_facebook%20small.svg" loading="lazy" alt=""></img></a>
                </div>
            </div>
            </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-copyright-center">Copyright © 2024 Ruby Oliveira</div>
        </section>
    </>
  )
}

export default Footer
