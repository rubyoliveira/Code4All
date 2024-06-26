import { useState, useEffect } from 'react'
import './LoginModal.css'


const LoginModal = ({closeModal}) => {

  return(
 <>
   <div className = "modal-signup">
        <form >
            <div className= "modal-content" >
                <button className = "close-modal" onClick = {closeModal}>&#10006;</button>
                <h2>Log In</h2>
                <label for="email"><b>Email</b></label>
                <input type="text" placeholder="Enter Email" name="email" required></input>
                <label for="psw"><b>Password</b></label>
                <input type="text" placeholder="Enter Password" name="psw" required></input>
                <button type= "submit" className = "create-account">Log in</button>
            </div>
        </form>
   </div>
 </>
  );
}

export default LoginModal
