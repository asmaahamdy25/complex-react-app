import React ,{useState ,useEffect} from 'react'
import {useParams , Link} from 'react-router-dom'
import Axios from 'axios'

import LoadingDotsIcons from './LoadingDotsIcons'

function ProfileFollowers(){
    const {username}= useParams();
const [isloading, setIsloading] = useState(true);
const [posts , setPosts] = useState([]);
useEffect(()=>{
    const ourRequestCancal = Axios.CancelToken.source();
    Axios.get(`/profile/${username}/followers`, {cancelToken : ourRequestCancal.token}).then(res =>{
        setPosts(res.data)
        setIsloading(false)
        
    })

    return()=>{
        ourRequestCancal.cancel();
    }
},[username])


if(isloading) return(<div><LoadingDotsIcons/></div>)
return(
    <div className="list-group">
        {posts.map((follower, index )=>{
            return(
              <Link  key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
            </Link>
            )
        })}
  </div>
)

}

export default ProfileFollowers