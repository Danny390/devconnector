import React, {Fragment, useState} from 'react'
//connects this component to redux
import {connect} from 'react-redux'
import {setAlert} from '../../actions/alert'
import {register} from '../../actions/auth'
// import axios from 'axios'; was used for testing purposes
import {Link, Navigate} from 'react-router-dom'
import PropTypes from 'prop-types'


const Register = ({setAlert, register, isAuthenticated}) => {
    const [formData, setFormData] = useState({//useState hook for getting text/data from form
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const {name, email, password, password2} = formData;//pulls data out for us to use(detructures them)

    const onChange = e => setFormData({
        ...formData, [e.target.name]: e.target.value //we [e.target.name] so that whichever field is being
                                                     //edited by the user gets updated: the html name
                                                    //attribute below has different fields(name, email, etc.)
                                                 //this function updates formData with the new text from user
    });

    const onSubmit = async (e) => {
        e.preventDefault(); //Standard for onSubmit
        if(password !== password2){
            setAlert('Passwords do not match', 'danger');
        }else{
            register({name, email, password});
        }
    }
    
    if(isAuthenticated){
      return <Navigate  to="/dashboard"/>
    }

  return (
  <Fragment> <h1 className="large text-primary">Sign Up</h1>
  <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
  <form className="form" onSubmit={e => onSubmit(e)}>
    <div className="form-group">
      <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)}/>
    </div>
    <div className="form-group">
      <input type="email" placeholder="Email Address" name="email" 
      value={email} onChange={e => onChange(e)} />
      <small className="form-text"
        >This site uses Gravatar so if you want a profile image, use a
        Gravatar email</small
      >
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
    <div className="form-group">
      <input
        type="password"
        placeholder="Confirm Password"
        name="password2"
        value={password2} 
        onChange={e => onChange(e)}
      />
    </div>
    <input type="submit" className="btn btn-primary" value="Register" />
  </form>
  <p className="my-1">
    Already have an account? <Link to="/login">Sign In</Link>
  </p>
  </Fragment>
  );
}
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
}) 

export default connect(mapStateToProps, {setAlert, register})(Register);
