import React, { useEffect, useContext, useState } from 'react'
import Pages from './pages'
import { useParams, NavLink, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
import StateContext from '../StateContext'
import ProfilePost from './profilePost'
import ProfileFollowers from './ProfileFollowers'
import ProfileFollowing from './ProfileFollowing'
import { useImmer } from 'use-immer'

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowRequestCount: 0,
    profileData: {
      profileUsername: '...',
      profileAvatar: "https://gravatar.com/avatar/f6e2c7034459cc04a485d3d5e9c2c51c?s=128",
      isFolllowing: false,
      counts: { postCount: 0, followingCount: 0, followerCount: 0 }
    }

  })
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    Axios.post(`/profile/${username}`, { token: appState.user.username }).then(res => {
      setState(draft => {
        draft.profileData = res.data
      })
    })

    return () => {
      ourRequest.cancel()
    }
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      const ourRequest = Axios.CancelToken.source()
      setState(draft => {
        draft.followActionLoading = true
      })
      Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }).then(res => {
        setState(draft => {
          draft.profileData.isFolllowing = true;
          draft.profileData.counts.followerCount++;
          draft.followActionLoading = false
        })
      })
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.startFollowingRequestCount])


  useEffect(() => {
    if (state.stopFollowRequestCount) {
      const ourRequest = Axios.CancelToken.source()
      setState(draft => {
        draft.followActionLoading = true
      })
      Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }).then(res => {
        setState(draft => {
          draft.profileData.isFolllowing = false;
          draft.profileData.counts.followerCount--;
          draft.followActionLoading = false
        })
      })
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.stopFollowRequestCount])

  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowRequestCount++
    })
  }



  return (
    <Pages title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFolllowing && appState.user.username != state.profileData.profileUsername
          && state.profileData.profileUsername != '...' &&
          (<button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>)
        }
        {appState.loggedIn && state.profileData.isFolllowing && appState.user.username != state.profileData.profileUsername
          && state.profileData.profileUsername != '...' &&
          (<button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2"> stop Following <i className="fas fa-user-times"></i></button>)
        }
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePost />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowers />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing />
        </Route>
      </Switch>




    </Pages>
  )
}

export default Profile 