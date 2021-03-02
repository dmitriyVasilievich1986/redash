import React, { useState } from 'react'
import sendPostData from '../common/sendPostData'
import { connect } from 'react-redux'
import { setIsLoading, addNewDashboard } from '../../actions/mainActions'

function AddDashboard(props) {
    const [name, updateName] = useState('новый борд')
    const sendAddNewDashboard = () => {
        const context = {
            method: 'create_dashboard',
            name: name,
        }
        sendPostData(props.path, context, props.addNewDashboard, props.setIsLoading)
    }
    return (
        <div style={{ marginTop: '2rem' }}>
            <label>Создать новый борд:</label>
            <div style={{ marginTop: "1rem" }}>
                <label>Название:</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Название"
                    value={name}
                    onChange={e => updateName(e.target.value)} />
            </div>
            <button onClick={sendAddNewDashboard} className="edit-button">Создать</button>
        </div>
    )
}

const mapStateToProps = state => ({
    path: state.main.path,
})

export default connect(mapStateToProps, { setIsLoading, addNewDashboard })(AddDashboard)
