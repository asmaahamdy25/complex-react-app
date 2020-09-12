import React ,{useEffect,useState , useContext} from 'react';
import Pages from './pages'
import {useParams , Link , withRouter} from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcons from './LoadingDotsIcons'
import ReactMarkDown from 'react-markdown'
import ReactTooltip  from 'react-tooltip'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function SinglePost(props){
  const appState = useContext(StateContext);
  const dispatchApp = useContext(DispatchContext)
  const {id}=useParams();
  const [post ,setPost] = useState();
  const [isloading ,setIsLoading] = useState(true);
  useEffect(()=>{
    Axios.get(`/post/${id}`).then(res =>{
        setPost(res.data)
        setIsLoading(false)
       
    })

},[])

function isOwner(){
  if(appState.loggedIn){
    return appState.user.username == post.author.username
  }
  return false
}

function  handelDeletePost(){
  const areYouSure = window.confirm('Are you sure to delete this post');

  if(areYouSure){ 
    Axios.delete(`/post/${id}`,{ data: {token : appState.user.token}}).then(res=>{

      if(res.data == 'Success'){
        dispatchApp({type :'flashMessage' , value:'Post was successfully deleted '});
        props.history.push(`/profile/${appState.user.username}`)
      }
    });
  }
}
 
if(!isloading && !post) return(<NotFound/>)
if(isloading) return( <Pages title="..."><LoadingDotsIcons/></Pages>)
const createdDate = new Date(post.createdDate);
const dateFormate = `${createdDate.getMonth()+1} / ${createdDate.getDay()}/ ${createdDate.getFullYear()}`
    return(
        <Pages title={post.title}>
        <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() &&
                <span className="pt-2">
                <Link to={`/post/${post._id}/edit`} className="text-primary mr-2" data-tip="Edit" data-for="edit"><i className="fas fa-edit"></i></Link>
                <ReactTooltip id="edit"/>
                <a className="delete-post-button text-danger" onClick={handelDeletePost} data-tip="Delete" data-for="delete"><i className="fas fa-trash"></i></a>
                <ReactTooltip id="delete"/>
              </span>
        }

      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`} >
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link  to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormate}
      </p>

      <div className="body-content">
        <ReactMarkDown source={post.body}/>
      </div>

        </Pages>

    )
}

export default withRouter(SinglePost)