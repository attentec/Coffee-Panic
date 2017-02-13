import React, { Component, PropTypes } from 'react'

class Alarm extends Component{

  render(){
    return(
      <div>
        <li>{this.props.alarm.text}</li>
      </div>
    )
  }
}

Alarm.propTypes = {
  alarm: PropTypes.object.isRequired
}

export default Alarm
