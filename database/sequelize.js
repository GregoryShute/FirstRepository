var postgres = require('./postgres');
var pg = postgres.pg;
var Sequelize = require('sequelize');
var async = require('async');
var postgresUrl = 'postgres://localhost:5432/testdb';
var database = 'testdb';
var username = 'gregoryshute';
var password = '';

module.exports = function(){
    console.log(Sequelize); 
};
