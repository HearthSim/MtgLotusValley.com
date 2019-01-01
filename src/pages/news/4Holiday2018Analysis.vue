<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <span class="newsTitle headline white--text font-weight-bold">Pauper analysis after first week of Holiday event</span>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2018-12-31 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="body-1 mt-2">
            Holiday Pauper event has started one week ago offering a format where only common cards are
            allowed and bringing to Magic Arena the promotional cards
            <Card :name='llanowarElvesPromo.name' :imageUrl='llanowarElvesPromo.imageUrl' :multiverseid='llanowarElvesPromo.multiverseid' :asText='true'/>
            and <Card :name='firemindsResearchPromo.name' :imageUrl='firemindsResearchPromo.imageUrl' :multiverseid='firemindsResearchPromo.multiverseid' :asText='true'/>.
            Below you will find some analysis of more than a thousand Holiday Pauper games tracked by <a href="/lotustracker" target="_blank">Lotus Tracker</a>.
          </span>
          <v-layout row class="mt-4">
            <v-flex xs12 sm7 class="pt-2">
              <span class="title">General Info</span>
              <ul class="mt-3">
                <li class="mt-2">Matches between 2018/12/24 and 2018/12/31</li>
                <li class="mt-2">1334 games tracked</li>
                <li class="mt-2">788 wins</li>
                <li class="mt-2">546 losses</li>
                <li class="mt-2">153 decks</li>
                <li class="mt-2">32% of decks were UB</li>
                <li class="mt-2">A 4-Colors deck has the highest winrate, 90,9% winrate in 11 games</li>
              </ul>
            </v-flex>
            <v-flex xs12 sm5>
              <div class="m-auto">
                <DecksColorDistribution :colors="decksByColors" :id="0"/>
              </div>
            </v-flex>
          </v-layout>

          <span class="title mt-4">Most Present Deck Colors</span>
          <HorizontalBar :data="decksByGuildsData" :labels="decksByGuildsLabels" title=""/>

          <span class="title mt-4">Most Present Cards</span>
          <span class="body-1 mt-3">
            <Card :name='healersHawk.name' :imageUrl='healersHawk.imageUrl' :multiverseid='healersHawk.multiverseid'
             :asText='true'/> was by far the most used card, being present in 32% of decks with a total of 186 copies.
          </span>
          <v-layout class="mt-2 text-xs-center" row wrap>
            <v-layout column class="card mt-3 ml-3 mr-3" v-for="card in topMostUsedCards()" :key="card.mtgaid">
              <Card :imageUrl='card.imageUrl' :imageUrlTransformed='card.imageUrlTransformed'
                :name='card.name' :multiverseid='card.multiverseid' :qtd='-1'/>
              <span>{{card.presence}}% of decks</span>
              <span>{{card.copies}} total copies</span>
              <span>{{card.copiesAverage}} average copies</span>
            </v-layout>
          </v-layout>
          
          <span class="title mt-4">Decks with best winrate</span>
          <span class="body-1 mt-3">
            A very nice surprise here is that a 4-Colors deck was the deck with highest winrate.
            It's heavy based on auras that can target 8 creatures with hexproof to avoid removals.
            To provide more consistense and help to find they hexproof creatures, the deck also has two
            <Card :name='SumalaWoodshaper.name' :imageUrl='SumalaWoodshaper.imageUrl' :multiverseid='SumalaWoodshaper.multiverseid' :asText='true'/>.
          </span>
            
          <v-layout class="mt-2 text-xs-center" row wrap>
            <v-layout column class="deck mt-3 ml-2" v-for="deck in decksHighestWinRate" :key="deck.id">
              <Deck class="mt-2 mb-2 m-auto" :cards="deck.cards" :name="deck.name"
                :details="`${deck.games} games (${deck.winrate}% winrate)`" :link="true"/>
            </v-layout>
          </v-layout>

          <span class="body-1 mt-5">
            Since the Holiday Event will be open until january 4th, take a deck and go ahead get your 
            <Card :name='llanowarElvesPromo.name' :imageUrl='llanowarElvesPromo.imageUrl' :multiverseid='llanowarElvesPromo.multiverseid' :asText='true'/>
            and <Card :name='firemindsResearchPromo.name' :imageUrl='firemindsResearchPromo.imageUrl' :multiverseid='firemindsResearchPromo.multiverseid' :asText='true'/>
            copies.            
          </span>
          
          <span class="body-1 mt-3 text-xs-center">
            If you want do some more analysis, all data can be downloaded
            <a href="static/files/holiday_2018-31_12.json" download>here</a>.
          </span>

          <vue-disqus class="mt-5" shortname="mtglotusvalley"/>

        </v-layout>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>

import Card from '@/components/mtg/Card'
import Deck from '@/components/mtg/Deck'
import DecksColorDistribution from '@/components/charts/DecksColorDistribution'
import HorizontalBar from '@/components/charts/HorizontalBar'

import MostUsedCards from './4Holiday_2018-MostUsedCards.json'
import MatchesByColors from './4Holiday_2018-MatchesByColors.json'
import HighestWinRate from './4Holiday_2018-HighestWinRate.json'

export default {
  name: 'LotusTracker',
  components: {
    Card, Deck, DecksColorDistribution, HorizontalBar
  },
  head: {
    title: {
      inner: 'Pauper analysis after first week of Holiday event'
    },
    meta: [
      { p: 'og:title', c: 'Pauper analysis after first week of Holiday event' },
      { p: 'og:image', c: 'https://www.mtglotusvalley.com/static/images/RatColony.jpg' }
    ]
  },
  data () {
    return {
      decksByColors: {},
      decksByGuildsData: {},
      decksByGuildsLabels: {},
      decksHighestWinRate: HighestWinRate.slice(0, 9),
      firemindsResearchPromo: {
        name: 'Firemind\'s Research',
        multiverseid: 452921,
        imageUrl: 'https://img.scryfall.com/cards/border_crop/front/c/d/cd318e8f-418a-4e17-bf0e-a4bfc0fb8ebf.jpg?1541642671'
      },
      llanowarElvesPromo: {
        name: 'Llanowar Elves',
        multiverseid: 443056,
        imageUrl: 'https://img.scryfall.com/cards/border_crop/en/pdom/168.jpg?1525399106'
      },
      healersHawk: {
        name: 'Healer\'s Hawk',
        multiverseid: 452764,
        imageUrl: 'https://img.scryfall.com/cards/border_crop/front/3/3/3313bd5c-b657-47a3-822a-dd0d9165492a.jpg?1538878333'
      },
      SumalaWoodshaper: {
        name: 'Sumala Woodshaper',
        multiverseid: 452950,
        imageUrl: 'https://img.scryfall.com/cards/border_crop/front/8/c/8c4e427e-c061-43c5-9e8e-34bf5b447ab1.jpg?1538880567'
      }
    }
  },
  created () {
    this.$scrollToTop()
    this.decksByGuildsLabels = Object.keys(MatchesByColors).map(colors => colors.toUpperCase())
    this.decksByGuildsData = Object.keys(MatchesByColors).map(colors => MatchesByColors[colors])
  },
  mounted () {
    this.decksByColors = {
      b: 66,
      g: 33,
      r: 36,
      u: 69,
      w: 63
    }
  },
  methods: {
    topMostUsedCards: function () {
      MostUsedCards.sort((c1, c2) => c2.presence - c1.presence)
      return MostUsedCards.filter(c => !c.type.includes('Land')).slice(0, 10)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-bg {
    background-image: url('~@/assets/pages-headers/RatColony.jpg');
    height: 250px !important;
    position: relative;
  }
  @media (max-width: 767px) {
    .date {
      position: absolute;
      left: calc(100% - 145px);
      top: calc(20px);
    } 
  }
  @media (min-width: 768px) {
    .date {
      position: absolute;
      left: calc(100% - 145px);
      top: calc(100% - 40px);
    } 
  }
  .newsTitle {
    position: absolute;
    left: 16px;
    top: calc(100% - 40px);
  }
  .cardContainer {
    display: inline;
  }
  .card {
    width: 150px;
  }
  .deck {
    width: 250px;
  }
</style>
