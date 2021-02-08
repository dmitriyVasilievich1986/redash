import React from 'react'
import axios from 'axios'


function Refresh() {
    function clickHandler(e) {
        const someData = new FormData()
        someData.append('method', 'refresh')
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            .then(data => console.log(data.data))
            .catch(err => console.log(err))
    }
    return (
        <div className="m-4">
            <button onClick={clickHandler} className="btn btn-primary btn-sm pl-4 pr-4">Refresh</button>
        </div>
    )
}

export default Refresh