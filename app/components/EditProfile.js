import React ,{useEffect,useState , useContext} from 'react';
import Pages from './pages'
import {useParams , Link} from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcons from './LoadingDotsIcons'
import { useImmerReducer } from "use-immer"
import StateContext from '../StateContext'
import dispatchContext  from '../DispatchContext'
function EditProfile(){
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
    saveCount: 0
}

function ourReducer(draft,action){
    switch(action.type){
        case 'fetchComplete':
            draft.title.value =  action.value.title;
            draft.body.value = action.value.body;
            draft.isFeatchData = false
            return

        case 'titleChange':
            draft.title.value = action.value;
            return
        case 'bodyChange':
            draft.body.value = action.value;
            return
        case 'submitRequest':
          draft.saveCount++  
          return
          case 'saveRequestStarted':
              draft.isSaving = true;
              return
          case 'saveRequestEnded':
              draft.isSaving = false;
              return      

    }
}
const [state,dispatch] = useImmerReducer(ourReducer ,originalState);

  useEffect(()=>{
    Axios.get(`/post/${state.id}`).then(res =>{
        console.log(res);
        dispatch({type:'fetchComplete', value : res.data})
    })

},[])

useEffect(()=>{
    if(state.saveCount){
        dispatch({type:'saveRequestStarted'})
        Axios.post(`/post/${state.id}/edit`, {title :state.title.value , body : state.body.value , token:appState.user.token}).then(res =>{
            console.log(res);
            dispatch({type:'saveRequestEnded'})
            appDispatch({type:'flashMessage' , value:'Post was updated.'})
        })
    }

},[state.saveCount])

function handelSubmit(e){
    e.preventDefault();
    dispatch({type:'submitRequest'})

}
if(state.isFeatchData) return( <Pages title="..."><LoadingDotsIcons/></Pages>)
    return(
        <Pages title="Edit Post">

        <form onSubmit={handelSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus name="title" onChange={e=>dispatch({type:'titleChange', value :e.target.value} )}
           id="post-title" className="form-control form-control-lg form-control-title"
           value={state.title.value}
           type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea name="body" id="post-body" onChange={e=>dispatch({type:'bodyChange', value :e.target.value} )} 
          className="body-content tall-textarea form-control"
          value={state.body.value}
          type="text"></textarea>
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>Save New Post</button>
      </form>
        </Pages>

    )
}

export default EditProfile