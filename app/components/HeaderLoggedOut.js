import React , {useState , useContext} from 'react'
import axios from 'axios'
import DispatchContext from '../DispatchContext'

function HeaderLoggedOut(props){
    const appDispatch = useContext(DispatchContext)
    const [username , setUsername]= useState();
    const [password , setPassword]= useState()


    function login(e) {
        e.preventDefault();
        axios.post('login',{username,password}).then(res=>{
            if(res.data){
              appDispatch({type:"login" , data:res.data})

            }
            
        })

    }

    return(
        <form onSubmit={login} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input name="username" onChange={e=>setUsername(e.target.value)} className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
          </div>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input name="password" onChange={e=>setPassword(e.target.value)} className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
          </div>
        </div>
      </form>
    )
}

export default HeaderLoggedOut