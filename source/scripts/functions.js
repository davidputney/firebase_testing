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
      self.noteTypeSetter();
    },
    intializeHistory: function(){
      var self=this;
      self.retrieveDatabase();
      self.handleNoteCreate();
    },
    initializeNoteView: function () {
      var self=this;
      var key = self.getNoteKey();
      self.retrieveDatabaseNote(key);
    },
    initializeNoteEdit: function () {
      var self=this;
      var key = self.getNoteKey();
      self.retrieveDatabaseNote(key);
    },
    intializeWatchers: function () {
      var self=this;
      var button = document.getElementById('submit');
      var notePicker = document.getElementsByName('note-type')[0];
      button.addEventListener('click', function() {
        console.log('click');
        // self.getForms();
        self.handleDatabase();
      });
      notePicker.addEventListener('change', function() {
        console.log('blur');
        self.handleNoteTypeChanges(notePicker.value);
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
    noteTypeSetter: function () {
      var self=this;
      var noteType = self.getNoteKey();
      self.handleNoteTypeChanges(noteType);

      var noteTypePicker =document.getElementsByName('note-type')[0];
      noteTypePicker.value = noteType;
    },
    handleNoteCreate: function() {
      var self=this;
      var notePicker= document.getElementById('note-type-create');

      notePicker.addEventListener('change', function() {
        var noteType = notePicker.value;
        setTimeout(function(){
          window.location.href = 'index.html?noteType=' + noteType;
        }, 300);
      });
    },
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

      var noteDealIssuesSelect = document.getElementsByName('deal-issues')[0];
      var noteDiscussionPointsSelect = document.getElementsByName('discussion-points')[0];
      var noteMeetingDateSelect = document.getElementsByName('meeting-date')[0];
      var noteSiteVisitDateSelect = document.getElementsByName('site-visit-date')[0];

      var noteText = document.getElementsByName('note-text')[0].value;


      var noteType = document.getElementsByName('note-type')[0].value;
      var noteDate = document.getElementsByName('date')[0].value;


      var noteDealIssues = !noteDealIssuesSelect.disabled
        ? noteDealIssuesSelect.value
        : false;

      var noteDiscussionPoints = !noteDiscussionPointsSelect.disabled
        ? noteDiscussionPointsSelect.value
        : false;

      var noteMeetingDate = !noteMeetingDateSelect.disabled
        ? noteMeetingDateSelect.value
        : false;

      var noteSiteVisitDate = !noteSiteVisitDateSelect.disabled
        ? noteSiteVisitDateSelect.value
        : false;

       var noteInfo =
        {
          "noteDate": noteDate,
          "noteDealIssues": noteDealIssues,
          "noteDiscussionPoints": noteDiscussionPoints,
          "noteMeetingDate": noteMeetingDate,
          "noteSiteVisitDate": noteSiteVisitDate,
          "noteText": noteText,
          "noteType": noteType
        }

        return noteInfo;
    },
    handleDatabase: function (userInfo) { // adds info to DB
      var self=this;
      var userInfo = self.getForms();
      self.handlePostingModal(true);
      var ref=self.database;
      var usersRef = ref.child("notes");
      var newPostRef = usersRef.push(userInfo, function(error) {
        var postID = newPostRef.key();
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
          console.log("Data saved successfully.");
          self.handlePostingModal(false, postID);
        }
      });
    },
    handleDatabaseEdit: function (key) {
      var self=this;
      var userInfo = self.getForms();
      self.handlePostingModal(true);
      var ref = new Firebase('https://putneydbtest.firebaseio.com/notes');

      var updateRef = ref.child(key);
      updateRef.update(userInfo, function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
          console.log("Data saved successfully.");
          self.handlePostingModal(false, key);
        }
      });
    },
    handleDatabaseRemove: function (key) {
      var self=this;
      // self.handlePostingModal(true);
      var ref = new Firebase('https://putneydbtest.firebaseio.com/notes');

      var updateRef = ref.child(key);
      updateRef.remove(function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
          console.log("Data saved successfully.");
          // self.handlePostingModal(false, key);
        }
      });
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
            "noteDiscussionPoints": data.val().noteDiscussionPoints,
            "noteSiteVisitDate": data.val().noteSiteVisitDate,
            "noteMeetingDate": data.val().noteMeetingDate
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

        var date = self.fixDate(dataItem.noteDate);

        var a = document.createElement('A');
            a.href = 'record.html?key=' + dataItem.key;
            a.innerHTML = date;
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
    },
    retrieveDatabaseNote: function(key) {
      var self=this;
      var pageType= document.getElementsByTagName('BODY')[0].dataset.pagetype;

      var ref = new Firebase('https://putneydbtest.firebaseio.com/notes');

      ref.child(key).on("value", function(snapshot) {
        if (pageType === 'note-read') {
          self.buildSingleRecordPage(snapshot.val());
          self.handleEditButton(snapshot.key());
        }
        if (pageType === 'note-edit') {
          self.handleNoteEditDisplay(snapshot.val());
          self.handleEditSubmitButton(snapshot.key());
        }
      });
    },
    buildSingleRecordPage: function(entry) {
      var self=this;

      console.log(entry);

      var noteDate = self.fixDate(entry.noteDate);

      var noteContainer = document.getElementById('note-wrapper');
      var metaData = document.getElementById('metadata-wrapper');
      var noteContent = document.getElementById('note-content')

      var noteHedlineEl = document.createElement('H1');
      noteHedlineEl.classList.add('note-headline');
      var noteDateEl = document.createElement("P");
      var noteDealIssuesEl = document.createElement('P');
      var noteTextEl = document.createElement('P');


      noteHedlineEl.innerHTML = entry.noteType + ' Note';
      noteDateEl.innerHTML = '<strong>Note Date:</strong> ' + noteDate;
      noteDealIssuesEl.innerHTML = '<strong>Deal issues:</strong> ' + entry.noteDealIssues;
      noteTextEl.innerHTML = '<strong>Note text:</strong> ' + entry.noteText;

      noteContainer.insertBefore(noteHedlineEl, metaData);
      metaData.appendChild(noteDateEl);
      noteContent.appendChild(noteDealIssuesEl);
      noteContent.appendChild(noteTextEl);

      // optional note types
      if (entry.noteType === 'general'){
        var noteDiscussionPointsEl = document.createElement('P');
        noteDiscussionPointsEl.innerHTML = '<strong>Discussion Points:</strong> ' + entry.noteDiscussionPoints;
        noteContent.insertBefore(noteDiscussionPointsEl, noteTextEl);
      }
      if (entry.noteType === 'deal_issues') {
        var noteMeetingDateEl = document.createElement('P');
        var dateFixed = self.fixDate(entry.noteMeetingDate);
        noteMeetingDateEl.innerHTML = '<strong>Meeting Date:</strong> ' + dateFixed;
        noteContent.insertBefore(noteMeetingDateEl, noteTextEl);
      }
      if (entry.noteType === 'previsit' || entry.noteType === 'followup') {
        var date = !"undefined"
        ? self.fixDate(entry.noteSiteVisitDate)
        : entry.noteSiteVisitDate

        var noteSiteVisitDateEl = document.createElement('P');
        noteSiteVisitDateEl.innerHTML = '<strong>Site Visit Date:</strong> ' + date;
        noteContent.insertBefore(noteSiteVisitDateEl, noteTextEl);
      }
    },
    handleEditButton: function(key) {
      var editButton = document.getElementById('edit-button');
      editButton.addEventListener('click', function(){
        window.location.href = 'record_edit.html?key=' + key;
      });
    },
    handleEditSubmitButton: function(key) {
      var self=this;
      var editButton = document.getElementById('submit');
      editButton.addEventListener('click', function(){
      self.handleDatabaseEdit(key);
      });
    },
    handlePostingModal: function(state, key) {
      var self=this;

      var postingModal = document.getElementById('posting-modal');

      if (state === true) {
        postingModal.classList.add('posting-modal--active');
      }
      if (state === false) {
        setTimeout(function(){
          postingModal.classList.remove('posting-modal--active');
          window.location.href = 'record.html?key=' + key;
        }, 1000);
      }
    },
    handleNoteEditDisplay: function(entryData) {
      var self=this;

      self.handleNoteTypeChanges(entryData.noteType);

      var noteDealIssuesSelect = document.getElementsByName('deal-issues')[0];
      var noteDateSelect = document.getElementsByName('date')[0];
      var noteTextSelect = document.getElementsByName('note-text')[0];
      var noteTypeSelect = document.getElementsByName('note-type')[0];


      noteDateSelect.value = entryData.noteDate;
      noteTextSelect.value = entryData.noteText;
      noteDealIssuesSelect.value = entryData.noteDealIssues;
      noteTypeSelect.value = entryData.noteType;

      // optional data fields
      if (entryData.noteType === 'general') {
        var noteDiscussionPointsSelect = document.getElementsByName('discussion-points')[0];
        noteDiscussionPointsSelect.value = entryData.noteDiscussionPoints;
      }
      if (entryData.noteType === 'deal_issues') {
        var noteMeetingDateSelect = document.getElementsByName('meeting-date')[0];
        noteMeetingDateSelect.value = entryData.noteMeetingDate;
      }
      if (entryData.noteType === "previsit" || entryData.noteType === "followup") {
        var noteSiteVisitDateSelect = document.getElementsByName('site-visit-date')[0];
        noteSiteVisitDateSelect.value = entryData.noteSiteVisitDate;
      }
    },
    fixDate: function (date) {
      var rawDate = new Date(date);
      var resetDate = (rawDate.getMonth() + 1) + "/" + (rawDate.getDate() + 1) + "/" + rawDate.getFullYear();
      return resetDate;
    },
    getNoteKey: function() {
      var self=this;
      console.log('getNoteKey');
         var url = window.location.search.substring(1).split('=')[1];
         return url
    }
  };
