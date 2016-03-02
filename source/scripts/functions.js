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

      var noteType = document.getElementsByName('note-type')[0].value;
      var noteDate = document.getElementsByName('date')[0].value;
      var noteText = document.getElementsByName('note-text')[0].value;
      var noteDealIssues = document.getElementsByName('deal-issues')[0].value;
      var noteDiscussionPoints = document.getElementsByName('discussion-points')[0].value;

       var noteInfo =
        {
          "noteType": noteType,
          "noteDate": noteDate,
          "noteText": noteText,
          "noteDealIssues": noteDealIssues,
          "noteDiscussionPoints": noteDiscussionPoints
        }
      self.handleDatabase(noteInfo);
    },
    handleDatabase: function (userInfo) { // adds info to DB
      var self=this;
      var ref=self.database;
      var usersRef = ref.child("notes");
      var newPostRef = usersRef.push(userInfo);
    },
    retrieveDatabase: function () { //gets info from DB
      var self=this;
      var ref=self.database;
      var usersRef = ref.child("users");

      usersRef.orderByChild("date").on("value", function(snapshot) {
        snapshot.forEach(function(data, i) {
          var fooBar =
          {
            "key": data.key(),
            "noteType": data.val().noteType,
            "noteDate": data.val().noteDate,
            "noteText": data.val().noteText,
            "noteDealIssues": data.val().noteDealIssues,
            "noteDiscussionPoints": data.val().noteDiscussionPoints
          }
          bar.push(fooBar);
        });
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  };
