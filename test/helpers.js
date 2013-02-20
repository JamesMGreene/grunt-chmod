'use strict';

module.exports = {
  permsFromMode: function helpers$permsFromMode(rawMode) {
    return (parseInt(rawMode.toString(8), 10) % 1000);
  }
};