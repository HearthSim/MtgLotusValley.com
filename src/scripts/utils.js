
export default {
  colors: [
    { code: 'w', name: 'White', hexValue: '#EEEEEE', hexHoverValue: '#DDDDDD' },
    { code: 'u', name: 'Blue', hexValue: '#2196F3', hexHoverValue: '#42A5F5' },
    { code: 'b', name: 'Black', hexValue: '#000000', hexHoverValue: '#111111' },
    { code: 'r', name: 'Red', hexValue: '#F44336', hexHoverValue: '#EF5350' },
    { code: 'g', name: 'Green', hexValue: '#4CAF50', hexHoverValue: '#66BB6A' },
    { code: 'm', name: 'Multicolor', hexValue: '#FFC107', hexHoverValue: '#FFCA28' },
    { code: 'c', name: 'Colorless', hexValue: '#9E9E9E', hexHoverValue: '#BDBDBD' }
  ],
  rarities: [
    { code: 'c', name: 'Common', color: 'grey' },
    { code: 'u', name: 'Uncommon', color: 'blue-grey' },
    { code: 'r', name: 'Rare', color: 'amber' },
    { code: 'm', name: 'Mythic', color: 'deep-orange' }
  ],
  types: [
    { code: 'l', name: 'Lands' },
    { code: 'c', name: 'Creatures' },
    { code: 'i', name: 'Instants' },
    { code: 's', name: 'Sorceries' },
    { code: 'e', name: 'Enchantments' },
    { code: 'a', name: 'Artifacts' },
    { code: 'p', name: 'Planeswalkers' }
  ],
  sets: [
    { code: 'ANA', name: 'New Player Experience' },
    { code: 'XLN', name: 'Ixalan' },
    { code: 'RIX', name: 'Rivals of Ixalan' },
    { code: 'DAR', name: 'Dominaria' },
    { code: 'M19', name: 'Core Set 2019' },
    { code: 'GRN', name: 'Guilds of Ravnica' },
    { code: 'MED', name: 'Mythic Edition' }
  ],
  events: [
    { name: 'RankedConstructed', type: 'Constructed' },
    { name: 'QuickConstructed', type: 'Constructed' },
    { name: 'CompetitiveConstructed', type: 'Constructed' },
    { name: 'Draft', type: 'Limited' },
    { name: 'Sealed', type: 'Limited' },
    { name: 'Singleton', type: 'Constructed' },
    { name: 'Pauper', type: 'Constructed' },
    { name: 'Momir', type: 'Constructed' },
    { name: 'Exploration', type: 'Constructed' }
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
