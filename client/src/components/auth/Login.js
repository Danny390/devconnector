import React, {Fragment, useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
// import axios from 'axios'; was used for testing purposes
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import {login} from '../../actions/auth'


const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({//useState hook for getting text/data from form
        email: '',
        password: ''
    });

    const {email, password} = formData;//pulls data out for us to use(detructures them)

    const onChange = e => setFormData({
        ...formData, [e.target.name]: e.target.value //we [e.target.name] so that whichever field is being
                                                     //edited by the user gets updated: the html name
                                                    //attribute below has different fields(name, email, etc.)
                                                 //this function updates formData with the new text from user
    });

    const onSubmit = async (e) => {
        e.preventDefault(); //Standard for onSubmit
        login(email, password);     
    }

    //Redirect if logged in
    if(isAuthenticated){
      return <Navigate  to="/dashboard"/>
    }

  return (<Fragment> <h1 className="large text-primary">Sign In</h1>
  <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
  <form className="form" onSubmit={e => onSubmit(e)}>
    <div className="form-group">
      <input type="email" placeholder="Email Address" name="email" 
      value={email} onChange={e => onChange(e)} required/>
    </div>
    <div className="form-group">
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password} 
        onChange={e => onChange(e)}
      />
    </div>
    <input type="submit" className="btn btn-primary" value="Login" />
  </form>
  <p className="my-1">
    Don't have an account? <Link to="/register">Sign Up</Link>
  </p>
  </Fragment>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login)
