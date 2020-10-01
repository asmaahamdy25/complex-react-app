import React ,{useContext} from 'react'
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext';
import ReactTooltip  from 'react-tooltip'



function HeaderLoggedIn(props){
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext)

    function handelLoggedOut(){

      appDispatch({type:"logout"})
    }

    function handelSearchIcon(e){
      e.preventDefault();
      appDispatch({type : "openSearch"})

    }

    return(
                <div className="flex-row my-3 my-md-0">
          <a data-for="search"  data-tip="Search" className="text-white mr-2 header-search-icon" onClick={handelSearchIcon}>
            <i className="fas fa-search"></i>
          </a>
          <ReactTooltip place="bottom" id="search" className="custom-tooltip"/>
          {"  "} <span data-for="chat"  data-tip="Chat" onClick={() => appDispatch({type :"toggleChat"})}
           className= {"mr-2 header-chat-icon " + (appState.unreadCount ? "text-danger" : "text-white")} >
            <i className="fas fa-comment"></i>
            {appState.unreadCount ? <span className="chat-count-badge text-white"> 
            {appState.unreadCount > 10 ? appState.unreadCount : "9+"} </span> :''}
            
          </span>
          <ReactTooltip place="bottom" id="chat" className="custom-tooltip"/>
          {"  "} <Link data-for="profile"  data-tip="My Profile" to={`/profile/${appState.user.username}`} className="mr-2">
            <img className="small-header-avatar" src={appState.user.avatar}/>
          </Link>
          <ReactTooltip place="bottom" id="profile" className="custom-tooltip"/>
          {"  "} <Link className="btn btn-sm btn-success mr-2" to="/create-post">
            Create Post
          </Link>
          <button className="btn btn-sm btn-secondary" onClick={handelLoggedOut}>
            Sign Out
          </button>
        </div>
 
    )
}

export default HeaderLoggedIn