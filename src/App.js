import React, { Component } from 'react'
// import logo from './logo.svg'
import './App.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setField, sendData } from './redux/reducer/index'

class App extends Component {
    onChange = evt => {
        const { target } = evt
        const { setField } = this.props
        setField('link', target.value)
    }

    submit = evt => {
        const { sendData } = this.props
        evt.preventDefault()
        sendData()
        // console.log(formData)
    }
    render() {
        // console.log(this.props)
        const { link } = this.props
        return (
            <div className="App">
                <div className="head">
                    <h1>MangaDee Download</h1>
                </div>
                <form onSubmit={this.submit}>
                    <label>Link</label>
                    <input id="link" type="text" onChange={this.onChange} value={link} placeholder="Link" />
                </form>
            </div>
        )
    }
}

App.propTypes = {
    setField: PropTypes.func,
    sendData: PropTypes.func,
    link: PropTypes.string
}

export default connect(
    state => ({ link: state.mainReducer.link }),
    { setField, sendData }
)(App)
