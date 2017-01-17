// ActivityModal.js
import React                   from 'react';
import axios                   from 'axios';
import { observer }            from 'mobx-react';

import ActivityBox              from './ActivityBox';
import Store                    from './Store';
import TextField                from 'material-ui/TextField';
import DayPicker, { DateUtils } from 'react-day-picker';
import MuiThemeProvider         from 'material-ui/styles/MuiThemeProvider';
import Snackbar                 from 'material-ui/Snackbar';

import 'react-day-picker/lib/style.css';

var activityArray = ['Call', 'Email', 'Apply', 'Connect', 'Meet-Up', 'Follow Up', 'Resume', 'Interview', 'Offer' ];
var typeArray     = ['phone', 'email', 'apply', 'connections', 'meetup', 'follow up', 'resume', 'interview', 'offer'];
var iconNameArray = ['phone', 'email', 'send', 'contact_phone', 'build', 'loop', 'reorder', 'bookmark', 'stars'];


@observer class ActivityModal extends React.Component {


  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.saveDate = this.saveDate.bind(this);
    this.state = {
      snack: false,
      errorMessage: '',
    };

  }

  componentWillMount() {
    
    if (this.props.action !== undefined) { 
      Store.addActivity.scheduledTime = this.props.action.scheduledTime;
      Store.addActivity.description = this.props.action.description;
      Store.addActivity.company = this.props.action.company;
      // need to set the activty type
      typeArray.forEach((type, index) => {

        if (this.props.action.type === type) {
          Store.selectedActivityBox = index;
        }
      });
      
    }
  }

  saveDate (e, date) {
    e.preventDefault();

    Store.addActivity.scheduledTime = date;
  }

  handleClick (e) {

    e.preventDefault();

    Store.addActivity.company = this.props.job.company;
    Store.addActivity.actionSource = 'user';

    // do some error checking to make sure an action has been selected  also check for a description
    if (Store.selectedActivityBox !== -1 && 
        Store.addActivity.scheduledTime !== '' && 
        Store.addActivity.description !== '') {

      var activityNum = Store.selectedActivityBox;
      var type = typeArray[activityNum];

      if (this.props.id === -1) {

        var obj = {
          userId:         Store.currentUserId,
          jobId:          this.props.job.id,
          type:           type,
          description:    Store.addActivity.description,
          notes:          Store.addActivity.notes,
          company:        this.props.job.company,
          actionSource:   'user',
          scheduledTime:  Store.addActivity.scheduledTime,
          completedTime:  null
        };

        axios.post(`/actions`, obj)
        .then(function(response) {
          Store.jobActions.push(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });

      } else {

        var putObj = {
          type:           type,
          description:    Store.addActivity.description,
          scheduledTime:  Store.addActivity.scheduledTime,
          notes:          Store.addActivity.notes,
        };

        var that = this;

        axios.put(`/actions/${this.props.action.id}`, putObj)
        .then((response) => {
          console.log(Store.jobActions[that.props.id]);
          
          axios.get(`/actions/${Store.currentUserId}/${this.props.job.id}`)
            .then(function(response) {
              Store.jobActions = response.data;
              console.log('jobview actions results : ', response.data.map((action) => toJS(action)));
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
      } // end if/else for Post / Put

      Store.selectedActivityBox = -1;
      Store.addActivity.description = '';
      Store.addActivity.scheduledTime = '';
      Store.addActivity.notes = '';
      this.props.onClick();
    
    } else { 
      // will have to message that no task type selected.
      var errorMessage = 'Please include a task, date and description';
      this.setState({
        errorMessage: errorMessage,
        snack: true
      });
    }    
  }


  change(e) {
    Store.addActivity[e.target.name] = e.target.value;
  }


  render () {
    
    return (
      <div> 
        <div className="modalSelectors">
          <div className="activityModalType">
            <div  className="activityTypeHeader"> 
              <p>Activity Type</p>
            </div>
            <div className="activityModalIcons">
              {activityArray.map((activity, index) => {
                return (<ActivityBox type={activity} icon={iconNameArray[index]} key={index} id={index} />);
              })}
            </div>  
          </div>  
          <div>
            <DayPicker onDayClick={ this.saveDate } />
          </div>
        </div>
        <form>
          <div className="row">
            <div className="input-field col s12">
              <MuiThemeProvider >
                <TextField floatingLabelText="Description" multiLine={true} fullWidth={true}
                           name="description" onChange={this.change} value={Store.addActivity.description}/>
              </MuiThemeProvider> 
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">  
              <MuiThemeProvider >
                <TextField floatingLabelText="Notes" multiLine={true} fullWidth={true}
                          rows={3} rowsMax={6} name="notes" onChange={this.change} value={Store.addActivity.notes}/>
              </MuiThemeProvider>         
            </div>
          </div>
        </form>
        <div className="activityClose" onClick={this.handleClick.bind(this)}>Save</div>
        <MuiThemeProvider>
          <Snackbar open={this.state.snack}  message={`${this.state.errorMessage}`} autoHideDuration={2000}
                    onRequestClose={this.handleRequestClose}/>
        </MuiThemeProvider>

      </div>
    );
  }

}

export default ActivityModal;