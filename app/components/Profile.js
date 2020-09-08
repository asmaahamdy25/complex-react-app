import React ,{useEffect , useContext , useState} from 'react'
import Pages from './pages'
import {useParams} from 'react-router-dom'
import Axios  from 'axios'
import StateContext from '../StateContext'
import ProfilePost from './profilePost'

function Profile(){
    const {username}= useParams();
    const appState = useContext(StateContext)
    const [profileData , setPrfileData] = useState({
        profileUsername :'...',
        profileAvatar :"https://gravatar.com/avatar/f6e2c7034459cc04a485d3d5e9c2c51c?s=128",
        isFolllowing : false ,
        counts:{postCount:0 ,followingCount:0,followerCount:0}
    })

    useEffect(()=>{
        Axios.post(`/profile/${username}`, {token : appState.user.username}).then(res =>{
            console.log(res);
            setPrfileData(res.data)
            
        })

    },[])




    return(
<Pages title="Profile Screen">
<h2>
        <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePost/>
</Pages>
    )
}

export default Profile 