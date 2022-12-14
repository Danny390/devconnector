import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-forms/CreateProfile'
import AddExperience from './components/profile-forms/AddExperience'
import AddEducation from './components/profile-forms/AddEducation'
import PrivateRoute from './components/routing/PrivateRoute'
import Profiles from './components/profiles/Profiles'
import { loadUser } from './actions/auth'
import './App.css';
//For Redux (connects react to redux by surrounding entire app with provider)
import {Provider} from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken';

const App = () => {
  useEffect(() => {
    if(localStorage.token){
      setAuthToken(localStorage.token)
    }
    store.dispatch(loadUser());
  }, [])
  return (
    <Provider store={store}>
  <Router>
      <Navbar/>
      <Alert/>
      <Routes>
      <Route path="/" element={<Landing />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="profiles" element={<Profiles />} />
        <Route
            path="dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
          <Route
            path="create-profile"
            element={<PrivateRoute component={CreateProfile} />}
          />
           <Route
            path="edit-profile"
            element={<PrivateRoute component={CreateProfile} />}
          />
          <Route
            path="add-experience"
            element={<PrivateRoute component={AddExperience} />}
          />
          <Route
            path="add-education"
            element={<PrivateRoute component={AddEducation} />}
          />
      </Routes>
    </Router>
    </Provider>
  );
};
export default App;