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
      self.getForms();
    },
    intializeHistory: function(){
      var self=this;
      self.retrieveDatabase();
    },
    intializeWatchers: function () {
      var self=this;
      var button = document.getElementById('submit');

      button.addEventListener('click', function () {
        console.log('click');
        self.getForms();
      });
    },
    intializeDatabase: function() {
      var self=this;
      console.log('db intialize');
      var ref = new Firebase('https://putneydbtest.firebaseio.com/');

      self.database = ref;
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
