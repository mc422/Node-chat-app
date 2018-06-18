class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser (id) {
    var index = -1;
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      return undefined;
    } else {
      var removedUser = this.users[index];
      this.users.splice(index, 1);
      return removedUser;
    }
  }

  getUser (id) {
    return this.users.find(user => user.id === id);
  }

  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var nameArray = users.map((user) => user.name);
    return nameArray
  }
}

module.exports = {Users};
