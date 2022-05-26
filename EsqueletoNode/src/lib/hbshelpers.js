module.exports = {
    ifCond: function(v1, options) {
      if(v1%2 === 0) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  } 