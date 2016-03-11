//  this is a test

var pageFunctions = {
    intialize: function () {
      console.log('works');
      var self=this;
      this.intializeDatabase();
    },
    /*
    PAGE INITIALIZERS
    */
    initializeIndex: function(){
      var self=this;
      this.intializeWatchers(); //listens for clicks
      self.dateSetter();
      self.noteTypeSetter();
      self.initializeMultiSelect(".deal-issues-multi", "Add deal Issues");
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
    intializeMultiPage: function() {
      var self=this;
      self.initializeMultiSelect('.js-example-basic-multiple', "Add deal Issues");
      self.handleMultiTest();
      self.retrieveDatabasePropertyStatus();
      self.retrieveDatabaseChangelog();
    },
    initializeMultiSelect: function(el, plText) {
      var self=this;
      $(el).select2({
        placeholder: plText,
        allowClear: true
      });
    },
    initializeMultiSelectEdit: function(arr, field) {
      var self=this;
      var multiselect = document.getElementsByClassName(field)[0];

      if (arr.length !== 0) {
        var optionsList = multiselect.options;
        var i;
        for (i = 0; i < optionsList.length; i++) {
          arr.forEach(function(el) {
              if (optionsList[i].value === el) {
                optionsList[i].selected = true;
              }
            });
        }
      }
      $('.' + field).select2();
    },
    /*
    OTHER INITIALIZERS
    */
    intializeWatchers: function() {
      var self=this;
      var button = document.getElementById('submit');
      var notePicker = document.getElementsByName('note-type')[0];
      button.addEventListener('click', function() {
        self.handleDatabase();
      });
      notePicker.addEventListener('change', function() {
        self.handleNoteTypeChanges(notePicker.value);
      });
    },
    intializeDatabase: function() {
      var self=this;
      console.log('db intialize');
      var ref = new Firebase('https://putneydbtest.firebaseio.com/');
      self.database = ref;
    },
    /*
    NOTE CREATION
    */
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
    handleNoteTypeChanges: function(noteType) {
      var self=this;
      handleNoteFieldsDisable();

      if (noteType === "previsit" || noteType === "followup") {
        var siteVisitDate = document.getElementsByName('site-visit-date')[0];
        handleSiteVisit(siteVisitDate);
      } else if (noteType === "deal_issues") {
        var meetingDate = document.getElementsByName('meeting-date')[0];
        handleSiteVisit(meetingDate);
      } else if (noteType === "general") {
        var discussionPoints = document.getElementsByName('discussion-points')[0];
        handleSiteVisit(discussionPoints);
        self.initializeMultiSelect(".discussion-points-multi", "Add discussion points");
      }
      function handleSiteVisit (el) {
          el.disabled = false;
          el.parentNode.classList.add('form-active');
      }
      function handleNoteFieldsDisable() {
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

      var dealIssuesMulti = noteDealIssuesSelect.selectedOptions;
      var dealIssuesArr = [];
      for (i = 0; i < dealIssuesMulti.length; i++) {
          dealIssuesArr.push(dealIssuesMulti[i].value);
      }
      var discussionPointsMulti = noteDiscussionPointsSelect.selectedOptions;
      var discussionPointsArr = [];
      for (i = 0; i < discussionPointsMulti.length; i++) {
          discussionPointsArr.push(discussionPointsMulti[i].value);
      }
      var noteType = document.getElementsByName('note-type')[0].value;
      var noteDate = document.getElementsByName('date')[0].value;

      var noteDealIssues = !noteDealIssuesSelect.disabled
        ? dealIssuesArr
        : false;
      var noteDiscussionPoints = !noteDiscussionPointsSelect.disabled
        ? discussionPointsArr
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
        };
        return noteInfo;
    },
    /*
    ADD INFO TO DB
    */
    handleDatabase: function () { // adds info to DB
      var self=this;
      var userInfo = self.getForms();
      self.handlePostingModal(true);
      var ref = new Firebase('https://putneydbtest.firebaseio.com/');
      var notesRef = ref.child("notes");
      var newPostRef = notesRef.push(userInfo, function(error) {
        var postID = newPostRef.key();
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
          console.log("Data saved successfully.");
          self.handlePostingModal(false, postID);
        }
      });
    },
    /*
    GET INFO FROM DB
    */
    retrieveDatabase: function () { //gets info from DB
      var self=this;
      console.log('retrieveDatabase');
      var ref=self.database;
      var usersRef = ref.child("notes");
      var bar = [];

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
          };
          bar.push(fooBar);
        });
        self.handleTableData(bar);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    },
    retrieveDatabaseNote: function(key) {
      var self=this;
      var pageType= document.getElementsByTagName('BODY')[0].dataset.pagetype;

      var ref = new Firebase('https://putneydbtest.firebaseio.com/notes');

      ref.child(key).on("value", function(snapshot) {
        if (pageType === 'note-read') {
          self.buildSingleRecordPage(snapshot.val());
          self.handleEditButton(snapshot.key());
          self.handleEditDeleteButton(snapshot.key());
        }
        if (pageType === 'note-edit') {
          self.handleNoteEditDisplay(snapshot.val());
          self.handleEditSubmitButton(snapshot.key());
        }
      });
    },
    /*
    ALTER INFORMATION IN DB
    */
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
      var ref = new Firebase('https://putneydbtest.firebaseio.com/notes');

      var updateRef = ref.child(key);
      updateRef.remove(function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
          console.log("Data saved successfully.");
        }
      });
    },
    /*
    DISPLAY INFORMATION
    */
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
      buildResults(el);
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

        !dataItem.noteDiscussionPoints
          ? dataCellNoteDiscussionPoints.innerHTML = ""
          : dataCellNoteDiscussionPoints.innerHTML = dataItem.noteDiscussionPoints.join(', ');

        !dataItem.noteDealIssues
          ? dataCellNoteDealIssues.innerHTML = ""
          : dataCellNoteDealIssues.innerHTML = dataItem.noteDealIssues.join(', ');

        var noteDisplay = [dataCellDate, dataCellNoteType, dataCellNoteText, dataCellNoteDealIssues,  dataCellNoteDiscussionPoints];

        noteDisplay.forEach(function(el) {
          tableRow.appendChild(el);
        });
        table.appendChild(tableRow);
        }
    },
    buildSingleRecordPage: function(entry) {
      var self=this;

      var noteDate = self.fixDate(entry.noteDate);
      var noteContainer = document.getElementById('note-wrapper');
      var metaData = document.getElementById('metadata-wrapper');
      var noteContent = document.getElementById('note-content');
      var noteHedlineEl = document.createElement('H1');
      noteHedlineEl.classList.add('note-headline');
      var noteDateEl = document.createElement("P");
      var noteDealIssuesEl = document.createElement('P');
      var noteTextEl = document.createElement('P');

      noteHedlineEl.innerHTML = entry.noteType.replace(/_/i, ' '); + ' Note';
      noteDateEl.innerHTML = '<strong>Note Date:</strong> ' + noteDate;
      noteDealIssuesEl.innerHTML = '<strong>Deal Issues:</strong> ' + entry.noteDealIssues.join(', ');
      noteTextEl.innerHTML = '<strong>Note Text:</strong> ' + entry.noteText;

      noteContainer.insertBefore(noteHedlineEl, metaData);
      metaData.appendChild(noteDateEl);
      noteContent.appendChild(noteDealIssuesEl);
      noteContent.appendChild(noteTextEl);

      // optional note types
      if (entry.noteType === 'general'){
        var noteDiscussionPointsEl = document.createElement('P');
        noteDiscussionPointsEl.innerHTML = '<strong>Discussion Points:</strong> ' + entry.noteDiscussionPoints.join(', ');
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
          : entry.noteSiteVisitDate;

        var noteSiteVisitDateEl = document.createElement('P');
        noteSiteVisitDateEl.innerHTML = '<strong>Site Visit Date:</strong> ' + date;
        noteContent.insertBefore(noteSiteVisitDateEl, noteTextEl);
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
      noteTypeSelect.value = entryData.noteType;

      //  handles loading of multiselect data
      self.initializeMultiSelectEdit(entryData.noteDealIssues, "deal-issues-multi");

      // optional data fields
      if (entryData.noteType === 'general') {
        self.initializeMultiSelectEdit(entryData.noteDiscussionPoints, "discussion-points-multi");
      }
      else if (entryData.noteType === 'deal_issues') {
        var noteMeetingDateSelect = document.getElementsByName('meeting-date')[0];
        noteMeetingDateSelect.value = entryData.noteMeetingDate;
      }
      else if (entryData.noteType === "previsit" || entryData.noteType === "followup") {
        var noteSiteVisitDateSelect = document.getElementsByName('site-visit-date')[0];
        noteSiteVisitDateSelect.value = entryData.noteSiteVisitDate;
      }
    },
    /*
    MODALS
    */
    handlePostingModal: function(state, key) {
      var self=this;

      var postingModal = document.getElementById('posting-modal');

      if (state === true) {
        postingModal.classList.add('posting-modal--active');
      }
      else if (state === false  && key) {
        setTimeout(function(){
          postingModal.classList.remove('posting-modal--active');
          window.location.href = 'record.html?key=' + key;
        }, 1000);
      }
      else if (state === false  && !key) {
        setTimeout(function(){
          postingModal.classList.remove('posting-modal--active');
          window.location.href = 'record_history.html';
        }, 400);
      }
    },
    handleTagDeleteModal: function(state, string) {
      var self=this;
      console.log('handleTagDeleteModal', state, string);

      var modal = document.getElementById('tag-delete-modal');
      var modalMessage = document.getElementById('modal-message');

      modal.classList.add('posting-modal--active');
      modalMessage.innerHTML = "Confirm delete of deal issue " + string;
    },
    handleMultiTest: function() {
      var self=this;
      document.getElementById("tags-list").addEventListener("click", function(e) {
        if(e.target && e.target.nodeName == "LABEL") {
          var tagVal = e.target.innerHTML;
          self.handleTagDeleteModal(true, tagVal);
          self.handleTagDeleteButton(e.target);
        }
      });
    },
    /*
    BUTTON HANDLERS
    */
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
    handleEditDeleteButton: function(key) {
      var self=this;
      var deleteButton = document.getElementById('delete-button');
      var confirmButton = document.getElementById('confirm-delete');
      var cancelButton = document.getElementById('cancel-delete');
      var  editButton = document.getElementById('edit-button');
      deleteButton.addEventListener('click', function(){
        deleteButton.disabled = true;
        editButton.disabled = true;
        self.handlePostingModal(true, false);
      });
      confirmButton.addEventListener('click', function() {
        self.handleDatabaseRemove(key);
        self.handlePostingModal(false, false);
      });
      cancelButton.addEventListener('click', function() {
        var postingModal = document.getElementById('posting-modal');
        postingModal.classList.remove('posting-modal--active');
        deleteButton.disabled = false;
        editButton.disabled = false;
      });
    },
    handleTagDeleteButton: function(elClicked) {
      var self=this;
      var deleteButton = document.getElementById('confirm-tag-delete');
      var postingModal= document.getElementById('tag-delete-modal');

      deleteButton.addEventListener('click', function() {
        elClicked.classList.add('tag--checked');
        setTimeout(function(){
          postingModal.classList.remove('posting-modal--active');
        }, 400);
      });
    },
    buildTagList: function(tagListValues) {
      var self=this;
      var taglistElement = document.getElementById('tags-list');
      taglistElement.innerHTML = '';

      if (tagListValues) {
        tagListValues.forEach(function(el) {
          var checkbox = document.createElement('INPUT');
          checkbox.type = 'checkbox';
          checkbox.value = el.issueShort;
          checkbox.name = 'tags-list-item';
          checkbox.id = el.issueShort;
          checkbox.checked = true;
          checkbox.dataset.issue = el.issue;

          var label = document.createElement('LABEL');
          label.htmlFor = el.issueShort;
          label.innerHTML = el.issue;

          taglistElement.appendChild(checkbox);
          taglistElement.appendChild(label);
          });
      }
    },
    showPropertyStatus: function(status) {
      var self=this;
      if (status) {
        var propertyStatusForm = document.getElementById('watch-list-status-wrapper').elements['watch-list-status'].value = status.watchlistStatus;
        var watchLevelForm = document.getElementsByName('watch-level')[0].value = status.watchLevelStatus;
        var meetingFrequencyForm = document.getElementById('meeting-frequency').value = status.meetingFrequencyStatus;
        document.getElementsByName('effective-date')[0].value = self.dateGetter();
        self.buildTagList(status.dealIssuesStatus);
      }
      // clears values out of multiselect
      $(".js-example-basic-multiple").val(null).trigger("change");
    },
    handlePropertyStatusChange: function (currentStatus) {
      var self=this;

      var changeLog = [];
      var dealIssuesArr = [];
      var statusUpdate = currentStatus;

      var saveChangesBtn = document.getElementsByName('save-changes')[0];
      var cancelChangesBtn = document.getElementsByName('cancel-update')[0];
      var eventSelect = document.getElementsByName('deal-issues')[0];
      var effectiveDateForm = document.getElementsByName('effective-date')[0];
      var watchLevelForm = document.getElementsByName('watch-level')[0];
      var meetingFrequencyForm = document.getElementById('meeting-frequency');

      self.handlePropertyStatusActive();
      self.handleWatchlistToggle();

      // button click
      cancelChangesBtn.addEventListener('click', function(){
        self.retrieveDatabaseChangelog();
        self.retrieveDatabasePropertyStatus();
      });
      saveChangesBtn.addEventListener('click', function() {
          // get value from field
           var watchlistStatus = document.getElementById('watch-list-status-wrapper').elements['watch-list-status'].value;
           var effectiveDate = effectiveDateForm.value;
           var watchLevelStatus = watchLevelForm.value;
           var meetingFrequencyStatus = meetingFrequencyForm.value;

          if (watchlistStatus !== currentStatus.watchlistStatus) {
            statusUpdate.watchlistStatus = watchlistStatus;
            self.handleChangelogUpdate('Watchlist', watchlistStatus, effectiveDate);
          }

          if (watchLevelStatus.toString() !== currentStatus.watchLevelStatus.toString()) {
              statusUpdate.watchLevelStatus = watchLevelStatus;
              self.handleChangelogUpdate('Watch Level', watchLevelStatus);
          }
          if (meetingFrequencyStatus !== currentStatus.meetingFrequencyStatus) {
            statusUpdate.meetingFrequencyStatus = meetingFrequencyStatus;
            self.handleChangelogUpdate('Meeting Frequency', meetingFrequencyStatus);
          }
          var dealIssuesSelected = [].slice.call(eventSelect.selectedOptions);
          dealIssuesSelected.forEach(function (el) {
            var dealIssuesObject = {
              "issueShort": el.value,
              "issue": el.innerHTML
            };
            dealIssuesArr.push(dealIssuesObject);
            self.handleChangelogUpdate('Issue Added', el.innerHTML);
          });

          var tagsList = document.getElementById('tags-list').elements;
          if (tagsList) {
            var elementsArray = [].slice.call(tagsList);
            elementsArray.forEach(function (el) {
              if (el.checked) {
                dealIssuesArr.push(
                    {"issueShort": el.value,
                      "issue": el.dataset.issue
                    });
              }
              else if (!el.checked) {
                self.handleChangelogUpdate('Issue Resolved', el.dataset.issue);
              }
            });
          }
        statusUpdate.dealIssuesStatus = dealIssuesArr.sort();
        self.updatePropertyStatusDatabase(statusUpdate);
        });
    },
    handlePropertyStatusActive: function() {
      var self=this;
      var saveChangesBtn = document.getElementsByName('save-changes')[0];
        document.getElementById('forms-container').addEventListener('change', function(e) {
          if (e.target && e.target.matches("input") || e.target.matches("select")) {
            saveChangesBtn.disabled = false;
          }
        });
        $(".js-example-basic-multiple").on("select2:select", function (e) {
          saveChangesBtn.disabled = false;
      });
    },
    handleWatchlistToggle: function() {
      document.getElementById('watch-list-status-wrapper').addEventListener('change', function(e) {
        if (e.target && e.target.matches("input.watch-list-selector")) {
            document.getElementsByClassName('optional-form')[0].classList.add('form-active');
        	}
      });
    },
    updatePropertyStatusDatabase: function(status) { // adds info to DB
      var self=this;
      var ref = new Firebase('https://putneydbtest.firebaseio.com/');
      var notesRef = ref.child("propertyStatus");
      var newPostRef = notesRef.update(status, function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
          console.log("Property status saved successfully.");
          self.handlePropertyStatusModal();
        }
      });
    },
    updateChangelogDatabase: function(status) {
      var self=this;
      var ref = new Firebase('https://putneydbtest.firebaseio.com/');
      var notesRef = ref.child("changelog");
      var newPostRef = notesRef.push(status, function(error) {
        // var postID = newPostRef.key();
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
          console.log("Changelog database saved successfully.");
          // self.handlePropertyStatusModal();
        }
      });
    },
    handlePropertyStatusModal: function() {
      var self=this;
      $(".js-example-basic-multiple").val(null).trigger("change");
      document.getElementById('save-modal').classList.add('posting-modal--active')
      setTimeout(function(){
        document.getElementById('save-modal').classList.remove('posting-modal--active');
        document.getElementsByName('save-changes')[0].disabled = true;
        document.location.reload(true)
      }, 2000);
    },
    retrieveDatabasePropertyStatus: function(key) {
      var self=this;
      var ref = new Firebase('https://putneydbtest.firebaseio.com/propertyStatus');
      ref.on("value", function(snapshot) {
        self.showPropertyStatus(snapshot.val());
        self.handlePropertyStatusChange(snapshot.val());
      });
    },
    handleChangelogUpdate: function(updateType, value, date) {
      var self=this;
      if (!date) {
        var date = self.dateGetter();
      }
      var changeLogEntry = {
        "changeDate": date,
        "changeType": updateType,
        "changeValue": value
      }
      self.updateChangelogDatabase(changeLogEntry);
    },
    buildChangelog: function(changelogArr) {
      var self=this;

      changelogArr.reverse();

      var changelogTable = document.getElementById('changelog');

        changelogArr.forEach(function(el) {
          var changelogRow = document.createElement('TR');
          var dateCell = document.createElement('TD');
          var typeCell = document.createElement('TD');
          var changeCell = document.createElement('TD');
          var nameCell = document.createElement('TD');

          dateCell.innerHTML = self.fixDate(el.changeDate);
          typeCell.innerHTML = el.changeType;
          changeCell.innerHTML = el.changeValue;
          nameCell.innerHTML = 'jsmith';
          changelogRow.appendChild(dateCell);
          changelogRow.appendChild(typeCell);
          changelogRow.appendChild(changeCell);
          changelogRow.appendChild(nameCell);
          changelogTable.appendChild(changelogRow);
        });
    },
    retrieveDatabaseChangelog: function(key) {
      var self=this;
      var ref = new Firebase('https://putneydbtest.firebaseio.com/');
      var usersRef = ref.child("changelog");
      var bar = [];

      usersRef.on("value", function(snapshot) {
        snapshot.forEach(function(data, i) {
          var fooBar =
          {
            "changeDate": data.val().changeDate,
            "changeType": data.val().changeType,
            "changeValue": data.val().changeValue
          };
          bar.push(fooBar);
        });
        self.buildChangelog(bar);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    },
    /*
    UTILITIES
    */
    fixDate: function (date) {
      var rawDate = new Date(date);
      var resetDate = (rawDate.getMonth() + 1) + "/" + (rawDate.getDate() + 1) + "/" + rawDate.getFullYear();
      return resetDate;
    },
    getNoteKey: function() {
      var self=this;
      console.log('getNoteKey');
         var url = window.location.search.substring(1).split('=')[1];
         return url;
    },
    dateSetter: function() {
      var self=this;
      var datePicker = document.getElementsByName('date')[0];
      var meetingDatePicker = document.getElementsByName("meeting-date")[0];
      var dateSet = self.dateGetter();
      datePicker.value = dateSet;
      meetingDatePicker.value = dateSet;
    },
    dateGetter: function() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
        dd='0'+dd;
      }
      if(mm<10) {
        mm='0'+mm;
      }
      return (yyyy + '-' + mm + '-' + dd);
    },
    noteTypeSetter: function () {
      var self=this;
      var noteType = self.getNoteKey();
      self.handleNoteTypeChanges(noteType);
      var noteTypePicker = document.getElementsByName('note-type')[0];
      noteTypePicker.value = noteType;
    }
  };
