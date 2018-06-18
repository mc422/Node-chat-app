const expect = require('expect');
const {Users} = require('./users');

describe('Utils Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'user1',
        room: 'chat room 1'
      },
      {
        id: '2',
        name: 'user2',
        room: 'chat room 2'
      },
      {
        id: '3',
        name: 'user3',
        room: 'chat room 1'
      }
    ];
  })

  it('should add user object', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'test123',
      room: 'test room'
    };
    resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var id = '1';
    var user = users.removeUser(id);
    expect(user.id).toBe(id);
    expect(users.users.length).toBe(2);
    expect(users.users).toContainEqual({
      id: '2',
      name: 'user2',
      room: 'chat room 2'
    });
    expect(users.users).toContainEqual({
      id: '3',
      name: 'user3',
      room: 'chat room 1'
    });
  });

  it('should not remove user', () => {
    var id = '5';
    var user = users.removeUser(id);
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find a user', () => {
    var id = '1';
    var user = users.getUser(id);
    expect(user.id).toBe(id);
  });

  it('should not find user', () => {
    var id = '4';
    expect(users.getUser(id)).toBeFalsy();
  });

  it('should return names of room 1', () => {
    var userList = users.getUserList('chat room 1');
    expect(userList).toEqual(['user1', 'user3']);
  });

  it('should return names of room 2', () => {
    var userList = users.getUserList('chat room 2');
    expect(userList).toEqual(['user2']);
  });
});
