import React , {useState , useContext} from 'react'
import Axios from 'axios'
import Pages from './pages'
import {withRouter} from 'react-router-dom'
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function CreatePost(props){
    const [title ,setTitle]=useState();
    const [body ,setBody] = useState();
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    function HandelCreate(e){
        e.preventDefault();
        Axios.post('/create-post',{title,body,token:appState.user.token}).then(res=>{
            console.log(res);
            appDispatch({ type: "flashMessage", value: "Congrats, you created a new post." })
            props.history.push(`/post/${res.data}`)
            
        })
    }

    return(
        <Pages title="Create New Post">

<form onSubmit={HandelCreate}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus name="title" onChange={(e)=>setTitle(e.target.value)} id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea name="body" id="post-body" onChange={(e)=>setBody(e.target.value)} className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
        </Pages>
    )
}

export default withRouter(CreatePost)
