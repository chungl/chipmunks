// associateJobs.js

var db = require('../index');


module.exports = function() {

  var status = ['new', 'favored', 'rejected'];
// get all users from the table, and include the parameter table
  db['User'].findAll({
    include: [ db['Parameter'] ] // check into adding , db['job'] to get access to the jobs
  }).then((users) => {
    // each item returned is a User array
    users.forEach((user, index) => {
      // each user has a Parameter's array
      user.Parameters.forEach((item, index) => {
        db['Parameter'].find({
          where: {
            id: item.id
          },
          include: [ db['Job'] ]
        }).then( job => {
        // this gets the Jobs associated with the parameter
          job.Jobs.forEach((item, index) => {
           db['UserJob'].find({
            where: {
              UserId: user.id,
              JobId:  item.id
            }
           }).then(foundLink => {
            if (!foundLink) {
              // this is working!
              user.addJobs(item.id, {status: 'new', createdAt: new Date(), updatedAt: new Date() } );
            }
           });
          });
        }).catch((err) => {
          console.error(err);
        });
      });
    });
  });
};