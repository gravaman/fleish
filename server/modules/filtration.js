let Filtration = {
  positionPctNav: function(filterable, { max, nav }) {
    return filterable.investables.filter(investable => investable.position / nav <= max)
  }
}

module.exports = Filtration
