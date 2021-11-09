'use strict';

const moviesModel = (sequelize, DataTypes) => sequelize.define('Movies', {
  name: {
      type: DataTypes.STRING,
      required: true
    },
  year: {
      type: DataTypes.INTEGER,
      required: true
    },
  rating: { 
      type: DataTypes.INTEGER,
    required: true
    }
});

module.exports = moviesModel;