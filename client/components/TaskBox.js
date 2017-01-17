// TaskBox.js
import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import axios from 'axios';
import Store from './Store';

var typeArray = ['phone', 'email', 'apply', 'connections', 'meetup', 'follow up', 'resume', 'interview', 'offer'];

@observer class TaskBox extends React.Component {

  constructor(props) {
    super(props);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);

  }

  //  probable can accomplish the below based on some math with the date and a component will mount
  // need a way to get an new group of items from the database and reconsitiue based on DONE status.


  handleDoneClick () {
    var that = this;
    axios.put(`/actions/${Store.currentUserId}/${this.props.task.id}`)
      .then(function(response) {
        console.log('task completed');
      })
      .catch(function(error) {
        console.log(error);
      });
    this.props.complete(this.props.task.id);
  }

  handleEditClick () {

    //Store.selectedActivityBox = this.props.task.id;

    var place = -1;
    typeArray.forEach((item, index) => {

      if (item === this.props.task.type) {
        console.log('location', index);
        place = index;
      }
    });

    Store.selectedActivityBox = place;
    console.log('Settting selectedActivityBox to: ', place);

    this.props.edit(this.props.task.id);


  }

  render() {

    var currDate = new Date();
    var dateMessage = '';
    var vis = {};
    var styles = {};
    var editIcon = 'edit';

    // sets proper date
    //console.log()
    if (this.props.task.completedTime !== null ) {
      dateMessage = 'Done';
      editIcon = 'loop';
    } else {
      
      console.log(this.props.task.scheduledTime);
      var days = Math.floor((new Date(this.props.task.scheduledTime).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
      if (days < -1) {
        dateMessage = 'Due ' + Math.abs(days) + ' days ago';
        styles = { highlight: {border: '1px solid red', 'backgroundColor': 'pink'}};
      } else if (days === -1) {
        dateMessage = 'Due yesterday';
        styles = { highlight: {border: '1px solid red', 'backgroundColor': 'pink'} };
      } else if (days === 0) {
        dateMessage = 'Due today';
        styles = { highlight: {border: '1px solid yellow', 'backgroundColor': 'lightyellow'} };
      } else if (days === 1) {
        dateMessage = 'Due tomorrow';
        styles = {highlight: {}};
      } else {
        dateMessage = 'Due in ' + days + ' days';
        styles = {highlight: {}};
      }
    }


    var iconNameArray = ['build', 'phone', 'loop', 'email', 'send',  'stars'];
    var actionType= ['like','learn','connections', 'apply', 'follow up', 'interview',
      'schedule', 'email', 'phone', 'offer', 'meetup','resume', 'phoneInterview', 'webInterview', 'personalInterview', 
      'sentEmail', 'receivedEmail'];
    
    var iconNames = ['thumb_up', 'computer', 'loop', 'send', 'loop', 'stars', 'loop', 'email', 'phone', 'stars', 'loop',
                    'reorder', 'stars', 'stars', 'stars', 'email', 'email'];

    var position = actionType.indexOf(this.props.task.type);
    
    var iconName = iconNames[position];

    console.log('task type:', iconName);
    return (
        <tr>
          <td> {dateMessage} </td>
          <td> <i className="material-icons">{iconName}</i> </td>
          <td>{this.props.task.description}</td>
          <td> <i className="material-icons" style={vis.hide} onClick={this.handleDoneClick.bind(this)}>done</i></td>
          <td> <i className="material-icons" style={vis.hide} onClick={this.handleEditClick.bind(this)}>{editIcon}</i></td>
        </tr>
    );
  }
}

export default TaskBox;
