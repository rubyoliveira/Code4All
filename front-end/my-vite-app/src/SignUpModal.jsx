import { useState, useEffect } from 'react'
import './SignUpModal.css'


const SignUpModal = ({closeModal}) => {

  return(
 <>
   <div className = "signup">
        <form >
            <div className= "signup-content" >
                <button className = "close-modal" onClick = {closeModal}>&#10006;</button>
                <h2>Make an Account</h2>
                <label htmlFor="email"><b>Name</b></label>
                <input type="text" placeholder="Enter Name" name="name" required></input>
                <label htmlFor="email"><b>Email</b></label>
                <input type="text" placeholder="Enter Email" name="email" required></input>
                <label htmlFor="psw"><b>Password</b></label>
                <input type="text" placeholder="Enter Password" name="psw" required></input>
                <label htmlFor="psw"><b>Confirm Password</b></label>
                <input type="password" placeholder="Confirm Password" name="psw" required></input>
                <button type= "submit" className = "create-account">Create Account</button>
            </div>
        </form>
   </div>
 </>
  );
}

export default SignUpModal
