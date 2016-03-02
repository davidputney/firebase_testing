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
        self.handleNoteTypeChanges(notePicker.value)

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
    handleNoteTypeChanges: function (noteType) {
      var self=this;
      console.log(noteType);
      handleDisable();

      if (noteType === "previsit" || noteType === "followup") {
        var siteVisitDate = document.getElementsByName('site-visit-date')[0];
        handleSiteVisit(siteVisitDate);
      }
      if (noteType === "deal_issues") {
        var siteVisitDate = document.getElementsByName('meeting-date')[0];
        handleSiteVisit(siteVisitDate);
      }
      if (noteType === "general") {
        var discussionPoints = document.getElementsByName('discussion-points')[0];
        handleSiteVisit(discussionPoints);
      }
      function handleSiteVisit (el) {
          el.disabled = false;
          el.parentNode.classList.add('form-active');
          // .classList.add("form-active");
      }
      function handleDisable () {
        var active = [].slice.call(document.querySelectorAll(".form-active"));
        active.forEach(function(el) {
          el.classList.remove('form-active');
          el.childNodes[3].disabled = true;
          console.log(el.childNodes[3]);
        });
      }
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
      console.log('retrieveDatabase');
      var ref=self.database;
      var usersRef = ref.child("notes");
      var bar = []

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
        // console.log(bar);
        self.handleTableData(bar);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    },
    handleTableData: function(arr) {
      var self=this;

      var notesSorted =  arr.sort(function(a,b){
          // console.log('a', a);
          var c = new Date(a.noteDate);
          var d = new Date(b.noteDate);
          return c-d;
        });

      notesSorted.reverse();

      notesSorted.forEach(function (el) {
        // console.log(el);
        buildResults(el)
      });

      function buildResults (dataItem) {
        var tableRow = document.createElement("TR");
        var table = document.getElementById('results-table');
        var dataCellDate = document.createElement("TD");
        var dataCellNoteType = document.createElement("TD");
        var dataCellNoteText = document.createElement("TD");
        var dataCellNoteDealIssues = document.createElement("TD");
        var dataCellNoteDiscussionPoints = document.createElement("TD");

        var a = document.createElement('A');
            a.href = 'record.html?key=' + dataItem.key;
            a.innerHTML = dataItem.noteDate;
            dataCellDate.appendChild(a);

        dataCellNoteType.innerHTML = dataItem.noteType;
        dataCellNoteText.innerHTML = dataItem.noteText;
        dataCellNoteDealIssues.innerHTML = dataItem.noteDealIssues;
        dataCellNoteDiscussionPoints.innerHTML = dataItem.noteDiscussionPoints;

        var noteDisplay = [dataCellDate, dataCellNoteType, dataCellNoteText, dataCellNoteDealIssues,  dataCellNoteDiscussionPoints];

        noteDisplay.forEach(function(el) {
          tableRow.appendChild(el);
        });

        table.appendChild(tableRow);

        }
    }
  };
