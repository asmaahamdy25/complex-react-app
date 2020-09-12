import React ,{useEffect,useState , useContext} from 'react';
import Pages from './pages'
import {useParams , Link , withRouter} from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcons from './LoadingDotsIcons'
import { useImmerReducer } from "use-immer"
import StateContext from '../StateContext'
import dispatchContext  from '../DispatchContext'
import NotFound from './NotFound'
function EditProfile(props){
    const  appState = useContext(StateContext);
    const  appDispatch = useContext(dispatchContext)
const originalState ={
    title:{
        value:'',
        haserror:false,
        message:''
    },
    body:{
        value:'',
        haserror:false,
        message:''
    },
    isFeatchData:true,
    isSaving:false,
    id:useParams().id,
    saveCount: 0,
    notFound:false
}

function ourReducer(draft,action){
    switch(action.type){
        case 'fetchComplete':
            draft.title.value =  action.value.title;
            draft.body.value = action.value.body;
            draft.isFeatchData = false;
            draft.notFound = false;
            return

        case 'titleChange':
            draft.title.haserror = false;
            draft.title.value = action.value;
            return
        case 'bodyChange':
            draft.body.haserror = false;
            draft.body.value = action.value;
            return
        case 'submitRequest':
            if(!draft.title.haserror && !draft.body.haserror){
                draft.saveCount++  
            }
          return
          case 'saveRequestStarted':
              draft.isSaving = true;
              return
          case 'saveRequestEnded':
              draft.isSaving = false;
              return  
              case 'titleRules':
                  if(!action.value.trim()){
                      draft.title.haserror = true;
                      draft.title.message = 'You must provide Title!'
                  }
                  return
                  case 'bodyRules':
                    if(!action.value.trim()){
                        draft.body.haserror = true;
                        draft.body.message = 'You must provide Body!'
                    }
                    return
            case 'notFoundData':
                draft.notFound = true

    }
}
const [state,dispatch] = useImmerReducer(ourReducer ,originalState);

  useEffect(()=>{
    Axios.get(`/post/${state.id}`).then(res =>{
        if(res.data){
            dispatch({type:'fetchComplete', value : res.data})
            if(appState.user.userName != res.data.author.username){
                appDispatch({type:'flashMessage' , value:'You donont have permisson to edit this post '})
                props.history.push('/')
            }

        }else{
            dispatch({type:'notFoundData'})
        }
    })

},[state.id])

useEffect(()=>{
    if(state.saveCount){
        dispatch({type:'saveRequestStarted'})
        Axios.post(`/post/${state.id}/edit`, {title :state.title.value , body : state.body.value , token:appState.user.token}).then(res =>{
            dispatch({type:'saveRequestEnded'})
            appDispatch({type:'flashMessage' , value:'Post was updated.'})
        })
    }

},[state.saveCount])

function handelSubmit(e){
    e.preventDefault();
    dispatch({type:'titleRules' , value: state.title.value})
    dispatch({type:'bodyRules' , value: state.body.value})
    dispatch({type:'submitRequest'})

}

if(state.notFound ) return(<NotFound/>)

if(state.isFeatchData) return( <Pages title="..."><LoadingDotsIcons/></Pages>)
    return(
        <Pages title="Edit Post">
        <Link className="small font-weight-bold " to={`/post/${state.id}`}>&laquo; Back to post permalink </Link>
        <form className="mt-3" onSubmit={handelSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus name="title" onBlur={e=> dispatch({type:'titleRules' , value:e.target.value})} onChange={e=>dispatch({type:'titleChange', value :e.target.value} )}
           id="post-title" className="form-control form-control-lg form-control-title"
           value={state.title.value}
           type="text" placeholder="" autoComplete="off" />
           {state.title.haserror && <div className="alert alert-danger small liveValidateMessage"> {state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea name="body" id="post-body" onBlur={e=> dispatch({type:'bodyRules' , value:e.target.value})} onChange={e=>dispatch({type:'bodyChange', value :e.target.value} )} 
          className="body-content tall-textarea form-control"
          value={state.body.value}
          type="text"></textarea>
           {state.body.haserror && <div className="alert alert-danger small liveValidateMessage"> {state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>Save New Post</button>
      </form>
        </Pages>

    )
}

export default withRouter(EditProfile)