
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
  captalize: function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  },
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
  remove: function (array, element) {
    const index = array.indexOf(element)
    if (index !== -1) {
      array.splice(index, 1)
    }
  }
}
