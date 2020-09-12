import React from 'react'
import Pages from './pages'
import {Link} from 'react-router-dom'

function NotFound(){

    return(
        <Pages title="Not Found">
            <div className="text-center">
                <h2> Whoos , we cannot found this page </h2>
                <p className="lead text-muted">
                    You can always visit <Link to="/">homePage</Link> to get refresh start

                </p>
            </div>

        </Pages>
    )

}

export default NotFound;