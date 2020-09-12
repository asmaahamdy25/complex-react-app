import React ,{useState ,useEffect} from 'react'
import {useParams , Link} from 'react-router-dom'
import Axios from 'axios'

import LoadingDotsIcons from './LoadingDotsIcons'

function ProfilePost(){
    const {username}= useParams();
const [isloading, setIsloading] = useState(true);
const [posts , setPosts] = useState([]);
useEffect(()=>{
    const ourRequestCancal = Axios.CancelToken.source();
    Axios.get(`/profile/${username}/posts`, {cancelToken : ourRequestCancal.token}).then(res =>{
        console.log(res);
        setPosts(res.data)
        setIsloading(false)
        
    })

    return()=>{
        ourRequestCancal.cancel();
    }
},[])


if(isloading) return(<div><LoadingDotsIcons/></div>)
return(
    <div className="list-group">
        {posts.map(post=>{
            const createdDate = new Date(post.createdDate);
            const dateFormate = `${createdDate.getMonth()+1} / ${createdDate.getDay()}/ ${createdDate.getFullYear()}`
            return(
              <Link  key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
              <span className="text-muted small">on {dateFormate} </span>
            </Link>
            )
        })}
  </div>
)

}

export default ProfilePost