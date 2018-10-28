
export default {
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
  getDeckWCMissingCost: function (userCollection, mainCards, sideboardCards) {
    const wcMissingCost = {}
    Object.keys(mainCards).forEach(mtgaId => {
      const card = mainCards[mtgaId]
      const qtdOwned = userCollection[mtgaId] !== undefined ? userCollection[mtgaId] : 0
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
        const qtdOwned = userCollection[mtgaId] !== undefined ? userCollection[mtgaId] : 0
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
  }
}
