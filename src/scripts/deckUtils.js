import Utils from '@/scripts/utils'

export default {
  sortByCmc: function (deckCards) {
    deckCards.sort(function (card1, card2) {
      if (card1.type.includes('Basic Land') && !card2.type.includes('Basic Land')) {
        return -1
      }
      if (!card1.type.includes('Basic Land') && card2.type.includes('Basic Land')) {
        return 1
      }
      if (card1.cmc !== card2.cmc) {
        return card1.cmc - card2.cmc
      }
      if (card1.name > card2.name) {
        return 1
      } else {
        return -1
      }
    })
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
  },
  getGroupCardsQtd: function (group) {
    if (group.length === 0) {
      return 0
    }
    if (group.length === 1) {
      return group[0].qtd
    }
    return group.map(card => card.qtd).reduce((acc, value) => acc + value)
  },
  getDeckColors: function (mainCards) {
    let colors = []
    Object.keys(mainCards).forEach(mtgaid => {
      const card = mainCards[mtgaid]
      if (card.colors !== undefined) {
        card.colors.forEach(color => {
          if (!colors.includes(color.toLowerCase())) {
            colors.push(color.toLowerCase())
          }
        })
      }
    })
    const color = Utils.guilds.find(color => color.colorsOrdered === colors.sort().join(''))
    if (color !== undefined) {
      return color.colors
    } else {
      return colors.sort().join('')
    }
  },
  getDeckManaCurve: function (mainCards) {
    const manaCurveCreatures = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7+': 0 }
    const manaCurveNonCreatures = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7+': 0 }
    const manaCurveTotal = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7+': 0 }
    Object.keys(mainCards).forEach(cardKey => {
      const card = mainCards[cardKey]
      if (!card.type.includes('Land')) {
        if (card.cmc >= 7) {
          manaCurveTotal['7+'] += card.qtd
        } else {
          manaCurveTotal[card.cmc] += card.qtd
        }
        if (card.type.includes('Creature')) {
          if (card.cmc >= 7) {
            manaCurveCreatures['7+'] += card.qtd
          } else {
            manaCurveCreatures[card.cmc] += card.qtd
          }
        } else {
          if (card.cmc >= 7) {
            manaCurveNonCreatures['7+'] += card.qtd
          } else {
            manaCurveNonCreatures[card.cmc] += card.qtd
          }
        }
      }
    })
    return {
      creatures: manaCurveCreatures,
      nonCreatures: manaCurveNonCreatures,
      total: manaCurveTotal
    }
  },
  getDeckWCCost: function (mainCards, sideboardCards) {
    const wcCost = {}
    Object.keys(mainCards).forEach(mtgaid => {
      const card = mainCards[mtgaid]
      if (!card.type.includes('Basic Land')) {
        if (wcCost[card.rarity] === undefined) {
          wcCost[card.rarity] = card.qtd
        } else {
          wcCost[card.rarity] += card.qtd
        }
      }
    })
    if (sideboardCards !== undefined && Object.keys(sideboardCards).length > 0) {
      Object.keys(sideboardCards).forEach(mtgaid => {
        const card = sideboardCards[mtgaid]
        if (!card.type.includes('Basic Land')) {
          if (wcCost[card.rarity] === undefined) {
            wcCost[card.rarity] = card.qtd
          } else {
            wcCost[card.rarity] += card.qtd
          }
        }
      })
    }
    return {
      'mythic': wcCost['mythic'],
      'rare': wcCost['rare'],
      'uncommon': wcCost['uncommon'],
      'common': wcCost['common']
    }
  },
  getDeckWCMissingCost: function (userCollection, mainCards, sideboardCards, reprintsCards) {
    const wcMissingCost = {}
    Object.keys(mainCards).forEach(mtgaId => {
      const card = mainCards[mtgaId]
      let qtdOwned = userCollection[mtgaId] !== undefined ? userCollection[mtgaId] : 0
      if (reprintsCards !== undefined && reprintsCards[mtgaId] !== undefined) {
        reprintsCards[mtgaId].forEach(reprintCard => {
          qtdOwned += userCollection[reprintCard.mtgaid] !== undefined ? userCollection[reprintCard.mtgaid] : 0
        })
      }
      const missingQtd = card.qtd - qtdOwned
      if (!card.type.includes('Basic Land') && missingQtd > 0) {
        if (wcMissingCost[card.rarity] === undefined) {
          wcMissingCost[card.rarity] = missingQtd
        } else {
          wcMissingCost[card.rarity] += missingQtd
        }
      }
    })
    if (sideboardCards !== undefined && Object.keys(sideboardCards).length > 0) {
      Object.keys(sideboardCards).forEach(mtgaId => {
        const card = sideboardCards[mtgaId]
        let qtdOwned = userCollection[mtgaId] !== undefined ? userCollection[mtgaId] : 0
        if (reprintsCards !== undefined && reprintsCards[mtgaId] !== undefined) {
          reprintsCards[mtgaId].forEach(reprintCard => {
            qtdOwned += userCollection[reprintCard.mtgaid] !== undefined ? userCollection[reprintCard.mtgaid] : 0
          })
        }
        const missingQtd = card.qtd - qtdOwned
        if (!card.type.includes('Basic Land') && missingQtd > 0) {
          if (wcMissingCost[card.rarity] === undefined) {
            wcMissingCost[card.rarity] = missingQtd
          } else {
            wcMissingCost[card.rarity] += missingQtd
          }
        }
      })
    }
    return {
      'mythic': wcMissingCost['mythic'] !== undefined ? wcMissingCost['mythic'] : 0,
      'rare': wcMissingCost['rare'] !== undefined ? wcMissingCost['rare'] : 0,
      'uncommon': wcMissingCost['uncommon'] !== undefined ? wcMissingCost['uncommon'] : 0,
      'common': wcMissingCost['common'] !== undefined ? wcMissingCost['common'] : 0
    }
  },
  exportDeckToArena: function (deckCards, sideboardCards) {
    let data = ''
    const cardsByType = this.groupCardsByType(deckCards)
    cardsByType['Sideboard'] = sideboardCards
    Object.keys(cardsByType).forEach(type => {
      const cards = cardsByType[type]
      if (type === 'Sideboard' && Object.keys(cards).length > 0) {
        data += '\n'
      }
      Object.keys(cards).forEach(mtgaId => {
        const card = cards[mtgaId]
        let set = card.set
        let number = card.number
        if (number === 'GR5' || number === 'GR8') {
          set = 'GRN'
        }
        if (number === 'GR6') {
          set = 'DAR'
        }
        if (set.startsWith('P') && set.length === 4) {
          set = set.substring(1, 4)
        }
        if (number.endsWith('a')) {
          number = number.replace('a', '')
        }
        data += `${card.qtd} ${card.name} (${set}) ${number}\n`
      })
    })
    Utils.copyStringToClipboard(data)
  },
  exportDeckToText: function (deckCards, sideboardCards) {
    let data = ''
    const cardsByType = this.groupCardsByType(deckCards)
    cardsByType['Sideboard'] = sideboardCards
    Object.keys(cardsByType).forEach(type => {
      const cards = cardsByType[type]
      if (Object.keys(cards).length > 0) {
        const qtd = Object.keys(cards).map(mtgaId => cards[mtgaId].qtd).reduce((p, n) => p + n)
        data += `\n${type} (${qtd})\n`
        Object.keys(cards).forEach(mtgaId => {
          const card = cards[mtgaId]
          data += `${card.qtd} ${card.name}\n`
        })
      }
    })
    Utils.copyStringToClipboard(data)
  },
  parseDeckText: function (text) {
    let deckText = text
    const numberOfEmptySpace = ((deckText || '').match(/\n\n/g) || []).length
    if (numberOfEmptySpace === 1) {
      deckText = deckText.replace(/\n\n/g, '/nsideboard')
    }
    let mainDeckText = deckText
      .replace(/\n\n/g, '\n')   // Remove empty line
      .replace(/\s+x\s/g, 'x ') // Remove spaces before x
      .replace(/[`’]/g, '\'')   // Fix
      .replace(/\t/g, ' ')      // Replace tab for space
      .replace(/\d+x\s/g, s => s.replace('x', ''))  // Remove qtd x
      .replace(/SB /gi, 'sideboard')        // Lowercase short sideboard
      .replace(/sideboard/gi, 'sideboard')  // Lowercase sideboard
    let sideboardDeckText = ''
    if (mainDeckText.includes('sideboard')) {
      const sideboardIndex = mainDeckText.indexOf('sideboard')
      sideboardDeckText = mainDeckText.substring(sideboardIndex)
      mainDeckText = mainDeckText.substring(0, sideboardIndex)
    }
    const re = /^\d+\s+(['\-/,A-Za-z]+[^\S\n]*)+/gm // Match any digit plus words with space but not newline
    const cardLines = mainDeckText.match(re)
    let cards = cardLines.map(line => line.replace(/\s{2,10}/g, ' ')  // Trim between text
      .replace(' ', ':')  // Use colon between qtd and card name
      .replace(/\s\d*[bgruwx]+\s/g, '')  // Remove mana cost if has
      .trim()
    ).filter(cardLine => !cardLine.toUpperCase().endsWith('LANDS') &&
      !cardLine.toUpperCase().endsWith('CREATURES') &&
      !cardLine.toUpperCase().endsWith('INSTANTS') &&
      !cardLine.toUpperCase().endsWith('SORCERIES') &&
      !cardLine.toUpperCase().endsWith('SORC.') &&
      !cardLine.toUpperCase().endsWith('SPELLS') &&
      !cardLine.toUpperCase().endsWith('ARTIFACTS') &&
      !cardLine.toUpperCase().endsWith('PLANESWALKERS')
    )
    let sideboard = []
    if (sideboardDeckText.length > 0) {
      const sideboardLines = sideboardDeckText.match(re)
      if (sideboardLines !== undefined && sideboardLines.length > 0) {
        sideboard = sideboardLines.map(line => line.replace(/\s{2,10}/g, ' ')  // Trim between text
          .replace(' ', ':')  // Use colon between qtd and card name
          .replace(/\s\d*[bgruwx]+\s/g, '')  // Remove mana cost if has
          .trim()
        )
      }
    }
    return {
      cards: cards.join(';'),
      sideboard: sideboard.join(';')
    }
  }
}
