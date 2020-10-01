import React, { useContext, useEffect } from 'react'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'
import Axios from 'axios'
import Post from './post'

function Search() {
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    searchTerm: '',
    result: [],
    show: 'neither',
    resultCount: 0
  })

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler)

    return () => document.removeEventListener("keyup", searchKeyPressHandler)

  }, [])

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = 'loading'
      })
      const delay = setTimeout(() => {
        setState(draft => {
          draft.resultCount++
          draft.show = 'result'
        })

      }, 750)

      return () => clearTimeout(delay)
    } else {
      setState(draft => {
        draft.show = 'neither'
      })
    }

  }, [state.searchTerm])

  useEffect(() => {
    if (state.resultCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResult() {
        try {
          const result = await Axios.post('/search', { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token });
          setState(draft => {
            draft.result = result.data
          })

        } catch (e) {

        }

      }
      fetchResult()
      return () => ourRequest.cancel()
    }

  }, [state.resultCount])

  function searchKeyPressHandler(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" })
    }

  }

  function handleInput(e) {
    const value = e.target.value;

    setState(darft => {
      darft.searchTerm = value
    })

  }

  return (
    <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field"
            placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader" + (state.show == 'loading' ? 'circle-loader--visible' : '')}></div>
          <div className={"live-search-results" + (state.show == 'result' ? "live-search-results--visible" : '')}>
      {Boolean(state.result.length) &&
      (      <div className="list-group shadow-sm">
      <div className="list-group-item active"><strong>Search Results</strong>
       ({state.result.length} {state.result.length > 1 ? 'items' : 'item'}  found)</div>
      {state.result.map(post => {
                return   <Post post={post} key={post._id} onClick={()=> appDispatch({type:"closeSearch"})}/>

      })}

    </div>)
      }

      {!Boolean(state.result.length) && (<p className="alert alert-danger text-center shadow-sm"> Sorry , We could not find any results for that search.</p>)}
          </div>
        </div>
      </div>
    </>
  )

}

export default Search