
export default {
  colors: [
    {code: 'w', desc: 'White', hexValue: '#EEEEEE', hexHoverValue: '#DDDDDD'},
    {code: 'u', desc: 'Blue', hexValue: '#2196F3', hexHoverValue: '#42A5F5'},
    {code: 'b', desc: 'Black', hexValue: '#000000', hexHoverValue: '#111111'},
    {code: 'r', desc: 'Red', hexValue: '#F44336', hexHoverValue: '#EF5350'},
    {code: 'g', desc: 'Green', hexValue: '#4CAF50', hexHoverValue: '#66BB6A'},
    {code: 'm', desc: 'Multicolor', hexValue: '#FFC107', hexHoverValue: '#FFCA28'},
    {code: 'c', desc: 'Colorless', hexValue: '#9E9E9E', hexHoverValue: '#BDBDBD'}
  ],
  types: [
    {code: 'l', desc: 'Lands'},
    {code: 'c', desc: 'Creatures'},
    {code: 'i', desc: 'Instants'},
    {code: 's', desc: 'Sorceries'},
    {code: 'e', desc: 'Enchantments'},
    {code: 'a', desc: 'Artifacts'},
    {code: 'p', desc: 'Planeswalkers'}
  ],
  sets: [
    {code: 'ANA', name: 'New Player Experience'},
    {code: 'XLN', name: 'Ixalan'},
    {code: 'RIX', name: 'Rivals of Ixalan'},
    {code: 'DAR', name: 'Dominaria'},
    {code: 'M19', name: 'Core Set 2019'},
    {code: 'GRN', name: 'Guilds of Ravnica'},
    {code: 'MED', name: 'Mythic Edition'}
  ],
  copyStringToClipboard: function (str) {
    var el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style = {position: 'absolute', left: '-9999px'}
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  },
  groupCardsByType: function (cards) {
    const cardsArray = []
    Object.keys(cards).forEach(mtgaId => {
      cardsArray.push(cards[mtgaId])
    })
    const data = {}
    data['Lands'] = cardsArray.filter(card => {
      return card.type.includes('Land') && !card.type.includes('Creature')
    })
    data['Creatures'] = cardsArray.filter(card => card.type.includes('Creature'))
    data['Spells'] = cardsArray.filter(card => {
      return card.type.includes('Instant') || card.type.includes('Sorcery')
    })
    data['Enchantments'] = cardsArray.filter(card => {
      return card.type.includes('Enchantment') && !card.type.includes('Creature')
    })
    data['Artifacts'] = cardsArray.filter(card => {
      return card.type.includes('Artifact') &&
        !card.type.includes('Creature') &&
        !card.type.includes('Land') &&
        !card.type.includes('Enchantment')
    })
    data['Planeswalkers'] = cardsArray.filter(card => card.type.includes('Planeswalker'))
    return data
  }
}
