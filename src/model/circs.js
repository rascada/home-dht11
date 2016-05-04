module.exports = function(mg) {
  return mg.model('circs', {
    temperature: Number,
    humidity: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
}
