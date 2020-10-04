import React , {useContext , useEffect , useRef}from 'react' 
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import {useImmer} from 'use-immer'
import io from 'socket.io-client'
import {Link} from 'react-router-dom'


function Chat (){
    const socket = useRef(null)
    const chatFeild = useRef(null)
    const chatLog = useRef(null)
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const [state ,setState] = useImmer({
        fieldValue :'',
        chatMessages :[]
    })

    function handelFieldChange(e){
        const value = e.target.value
        setState(draft=>{
            draft.fieldValue = value;
        })
    }

    useEffect(()=>{
      chatLog.current.scrollTop = chatLog.current.scrollHeight;
      if(state.chatMessages.lenght && !appState.isChatOpen){
        appDispatch({type :"incrementUnreadChatCount"})
      }

    },[state.chatMessages])

    useEffect(()=>{
        if(appState.isChatOpen){
            chatFeild.current.focus()
            appDispatch({type :"clearUnreadChatCount"})

        }

    },[appState.isChatOpen])

    useEffect(()=>{
        socket.current = io(process.env.BACKENDURL || "https://backendforreactsocialcourse.herokuapp.com")
        socket.current.on("chatFromServer" , message => {
            setState( draft => {
                draft.chatMessages.push({message : message})
            })
        })

        return ()=> socket.current.disconnect()
    })

    function handelSubmit(e) {
        e.preventDefault()
        socket.current.emit("chatFromBrowser" , {message : e.target.value , token : appState.user.token})
        setState((draft)=>{
            draft.chatMessages.push({message : draft.fieldValue , username : appState.user.username , avater : appState.user.avater})
            draft.fieldValue =""
        })
    }

    return(
        <div id="chat-wrapper" className={"chat-wrapper  shadow border-top border-left border-right  " + ( appState.isChatOpen ? "chat-wrapper--is-visible" :"")}>
        <div className="chat-title-bar bg-primary">
          Chat
          <span className="chat-title-bar-close" onClick={() => appDispatch({type :"closeChat"})}>
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
        <div id="chat" className="chat-log" ref={chatLog}>
           { state.chatMessages.map((message ,index) => {
               if(message.username === appState.user.username){
                   return(
                    <div className="chat-self" key={index}>
                    <div className="chat-message">
                   <div className="chat-message-inner">{message.message}</div>
                    </div>
                    <img className="chat-avatar avatar-tiny" src={message.avater} />
                  </div>
          
                   )
               }

               return(
                <div key={index} className="chat-other">
                <Link to={`/profile/${message.username}`}>
                  <img className="avatar-tiny" src={message.avater} />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                      <strong>{message.username}</strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
               )
           })}
        </div>
        <form id="chatForm" onSubmit={handelSubmit} className="chat-form border-top">
          <input value={state.fieldValue} ref={chatFeild} onChange={handelFieldChange} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
        </form>
      </div>
    )
}


export default Chat