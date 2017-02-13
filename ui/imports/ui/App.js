import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'

import Alarm from './Alarm.js'

import { AlarmSchema } from '../api/alarm.js'

// App component - represents the whole app
class App extends Component {
  getAlarm() {
    return [
      { _id: 1, text: 'This is alarm 1' },
      { _id: 2, text: 'This is alarm 2' },
      { _id: 3, text: 'This is alarm 3' },
    ];
  }

  renderAlarm() {
    return this.getAlarm().map((alarm) => (
      <Alarm key={alarm._id} alarm={alarm} />
    ));
  }

  render() {
    return (
      <div className="container">
          <Alarm />


      </div>
    )
  }
}

App.propTypes = {
  alarm: PropTypes.array.isRequired,
};

export default createContainer(() => {
  console.log(AlarmSchema._collection.name);
  return {
    alarm: AlarmSchema.find({}).fetch(),
  };
}, App);
