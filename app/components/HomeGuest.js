import React ,{useState} from 'react'
import Container from './Container'
import axios from'axios'
import {useImmerReducer} from 'use-immer'
import {CSSTransition} from 'react-transition-group'

function HomeGuest(){

  const initialState = {
    username :{
      value:'',
      haserror:false,
      message:'',
      isUnique:false,
      checkCount:0
    },
    email:{
      value:'',
      haserror:false,
      message:'',
      isUnique:false,
      checkCount:0
    },
    password:{
      value:'',
      haserror:false,
      message:'',
    },
    submitCount:0
  }

function ourReducer(draft , action ){
  switch(action.type){
    case 'usernameImmediately':
      draft.username.haserror = false;
      draft.username.value = action.value;
      if(draft.username.value.length > 30){
        draft.username.haserror = true;
        draft.username.message = "UserName cannot exceed 30 chratcter "
      }
      if(draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)){
        draft.username.haserror = true;
        draft.username.message = "UserName can oly conatin letters and numbers!"
      }
      return
    case 'usernsmeAfterDelay':
      return
    case 'usernameUniqueResult':
      return
    case 'emailImmediately':
      draft.email.haserror = false;
      draft.email.value = action.value; 
      return
    case 'emailAfterDelay' :
      return 
    case 'passwordImmediately':
      draft.password.haserror = false;
      draft.password.value = action.value;
      return
    case 'passwordAfterDelay':
      return
    case 'submitForm':
    return  
  }

}

const [state , dispatch ]= useImmerReducer(ourReducer,initialState)

  function submitForm(e){
    e.preventDefault();

      axios.post('/register',{username , email,password}).then( res=>console.log(res))
  }

    return(
        <Container wide={true}>
        <div className="row align-items-center">
          <div className="col-lg-7 py-3 py-md-5">
            <h1 className="display-3">Remember Writing?</h1>
            <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
          </div>
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <form onSubmit={submitForm}>
              <div className="form-group">
                <label htmlFor="username-register" className="text-muted mb-1">
                  <small>Username</small>
                </label>
                <input id="username-register" onChange={e=>dispatch({type:'usernameImmediately' , value:e.target.value})} name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
                <CSSTransition in={state.username.haserror}  timeout={330} className="alert alert-danger small liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.username.message} </div>
                  </CSSTransition>       
              </div>
              <div className="form-group">
                <label htmlFor="email-register" className="text-muted mb-1">
                  <small>Email</small>
                </label>
                <input id="email-register"   onChange={e=>dispatch({type:'emailImmediately' , value:e.target.value})} name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <small>Password</small>
                </label>
                <input id="password-register"  onChange={e=>dispatch({type:'passwordImmediately' , value:e.target.value})} name="password" className="form-control" type="password" placeholder="Create a password" />
              </div>
              <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Sign up for ComplexApp
              </button>
            </form>
          </div>
        </div>
      </Container>
    )
}

export default HomeGuest