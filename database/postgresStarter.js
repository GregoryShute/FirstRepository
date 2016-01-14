var postgres = require('./postgres');
var async = require('async');
var pg = postgres.pg;

module.exports = function () {

    var connection = 'postgres://localhost:5432/testdb';
    var client = new pg.Client(connection);
 

    function createPersonQuery(next) {
        client.query('CREATE TABLE IF NOT EXISTS person(person_id integer primary key, username char(40), hashedPassword text, salt text, privacy char(20))');
        next();
    };

    function createEmailQuery() {
        client.query('CREATE TABLE email(email_id integer primary key, address char(50))');
  
    };

    function createFriendQuery(next) {
        client.query('CREATE TABLE IF NOT EXISTS friend(person_id integer references person(person_id), friend_id integer primary key, friendname char(40))');
        next();
    };

    function createSentMailQuery(next) {
        client.query('CREATE TABLE IF NOT EXISTS sentmail(person_id integer references person(person_id), outboundRequestId integer primary key)');
        next();
    };

    function createInboxQuery(next) {
        client.query('CREATE TABLE IF NOT EXISTS inbox(person_id integer references person(person_id), inboundRequestId integer primary key)');
        next();
    };

};
