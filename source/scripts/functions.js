//  this is a test

var pageFunctions = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeDatabase();
    },
    initializeIndex: function(){
      var self=this;
      this.intializeWatchers(); //listens for clicks
      // self.getForms();
      self.dateSetter();
    },
    intializeHistory: function(){
      var self=this;
      self.retrieveDatabase();
    },
    intializeWatchers: function () {
      var self=this;
      var button = document.getElementById('submit');
      var notePicker = document.getElementsByName('note-type')[0];
      button.addEventListener('click', function() {
        console.log('click');
        self.getForms();
      });
      notePicker.addEventListener('change', function() {
        console.log('blur');
      });
    },
    intializeDatabase: function() {
      var self=this;
      console.log('db intialize');
      var ref = new Firebase('https://putneydbtest.firebaseio.com/');

      self.database = ref;
    },
    dateSetter: function() {
      var datePicker = document.getElementsByName('date')[0];
      var meetingDatePicker = document.getElementsByName("meeting-date")[0];
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
        dd='0'+dd
      }
      if(mm<10) {
        mm='0'+mm
      }
      var dateSet = (yyyy + '-' + mm + '-' + dd);
      datePicker.value = dateSet;
      meetingDatePicker.value = dateSet;
    },
    getForms: function() { // collects form data
      var self=this;

      var name = document.getElementById('name').value;
      var birth = document.getElementById('birth').value;
      var userName = document.getElementById('user').value;
      var nickname = document.getElementById('nickname').value;

       var userInfo =
        {
          "userName": userName,
          "name": name,
          "birth": birth,
          "nickname": nickname
        }
      self.handleDatabase(userInfo);
    },
    handleDatabase: function (userInfo) { // adds info to DB
      var self=this;
      var ref=self.database;
      var usersRef = ref.child("users");
      var newPostRef = usersRef.push(userInfo);
    },
    retrieveDatabase: function () { //gets info from DB
      var self=this;
      var ref=self.database;
      var usersRef = ref.child("users");

      usersRef.orderByKey().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
          console.log(data.val().nickname);
        });
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  };
