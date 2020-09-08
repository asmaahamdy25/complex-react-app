import React ,{useState ,useEffect} from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from './components/footer'
import {BrowserRouter , Switch ,Route} from 'react-router-dom'
import About from './components/About'
import Terms from './components/Terms'
import Home from './components/Home'
import CreatePost  from './components/CreatePost'
import SinglePost from './components/SinglePost'
import Profile from './components/Profile'
import FlashMessage  from './components/FlashMessage'
import EditPost from './components/EditProfile'
import Axios from'axios'
Axios.defaults.baseURL = 'http://localhost:8080'
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"


function MainComponent(){
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("token")),
        flashMessages: [],
        user: {
          token: localStorage.getItem("token"),
          username: localStorage.getItem("username"),
          avatar: localStorage.getItem("avatar")
        }
      }
    
      function ourReducer(draft, action) {
        switch (action.type) {
          case "login":
            draft.loggedIn = true
            draft.user = action.data
            return
          case "logout":
            draft.loggedIn = false
            return
          case "flashMessage":
            draft.flashMessages.push(action.value)
            return
        }
      }

      const [state, dispatch] = useImmerReducer(ourReducer, initialState)

      useEffect(() => {
        if (state.loggedIn) {
          localStorage.setItem("token", state.user.token)
          localStorage.setItem("username", state.user.username)
          localStorage.setItem("avatar", state.user.avatar)
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("username")
          localStorage.removeItem("avatar")
        }
      }, [state.loggedIn])
    

    return(
        <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
       <BrowserRouter>
       <FlashMessage messages={state.flashMessages}/>
       <Header/>
       <Switch>
           <Route path="/" exact>
             {state.loggedIn ?  <Home/> : <HomeGuest/>} 
           </Route>
           <Route path="/about-us" exact>
           <About/>
           </Route>
           <Route path="/terms" exact>
           <Terms/>
           </Route>
           <Route path="/create-post" exact>
           <CreatePost/>
           </Route>
           <Route path="/profile/:username">
             <Profile/>
           </Route>
           <Route path="/post/:id" exact>
           <SinglePost/>
           </Route>
           <Route path="/post/:id/edit" exact>
           <EditPost/>
           </Route>
       </Switch>

      <Footer/>
       </BrowserRouter>
       </DispatchContext.Provider>
       </StateContext.Provider>
    )
}

ReactDom.render(<MainComponent/> ,document.querySelector('#app'))
if(module.hot){
    module.hot.accept()
}