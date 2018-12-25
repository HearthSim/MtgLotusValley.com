  <template>
    <v-layout row wrap>
      <v-flex xs12>
        <Events/>
      </v-flex>
      <v-flex xs12>
        <v-layout class="box mt-0" row wrap>
          <v-flex xs12 class="boxHeader">Latest Constructed Decks</v-flex>
          <v-layout class="boxContent" row wrap>
            <LatestDecks />
          </v-layout>
        </v-layout>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs8>
          <v-layout class="box mt-0 mr-0" row wrap>
            <v-flex xs12 class="boxHeader">News</v-flex>
            <v-layout class="boxContent newsContainer mt-0" row wrap>

              <router-link v-for="(news, index) in latestNews" v-bind:key="index"
                class="news mt-3" :to="news.link">
                <v-card class="pt-1 pl-1 pr-1">
                  <img :src="news.cover" width="100%"/>
                  <v-layout class="mt-2 ml-3 mr-3" row nowrap>
                    <span class="title deep-orange--text text--lighten-1 font-weight-bold">{{news.title}}</span>
                    <v-spacer/>
                    <span class="subtitle font-weight-bold">
                      {{ new Date(news.date).toLocaleString().split(' ')[0].replace(',', '') }}
                    </span>
                  </v-layout>
                  <v-layout class="text-xs-left mt-2 ml-3 mr-3 pb-3" column nowrap>
                    <span class="body-1">{{news.subtitle}}</span>
                    <span class="body-1">{{news.details}}</span>
                  </v-layout>
                </v-card>
              </router-link>

            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex xs4>
          <v-layout class="box mt-0 pb-2" row wrap>
            <v-flex xs12 class="boxHeader">Colors Distribution (Last 7 days)</v-flex>
            <v-layout class="boxContent" row nowrap>
              <div class="m-auto">
                <DecksColorDistribution :colors="decksByColorsBasics" :title="false"/>
              </div>
            </v-layout>
          </v-layout>
          <v-layout class="box mt-0" row wrap>
            <v-flex xs12 class="boxHeader">Deck of Day</v-flex>
            <v-layout class="boxContent" row wrap>
              <Deck class="mt-2 mb-2 m-auto" :cards="deckOfDayCards" :name="deckOfDayName"/>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
</template>

<script>
import Deck from '@/components/mtg/Deck'
import Events from '@/components/home/Events'
import LatestDecks from '@/components/home/LatestDecks'
import DecksColorDistribution from '@/components/charts/DecksColorDistribution'

export default {
  name: 'Home',
  components: {
    Deck, Events, LatestDecks, DecksColorDistribution
  },
  created () {
    this.requestDeckOfDay()
    this.requestDeckByColorsBasics()
  },
  data () {
    return {
      deckOfDayName: '',
      deckOfDayCards: {},
      decksByColorsBasics: {},
      latestNews: [
        {
          cover: require('@/assets/pages-headers/Mountain1.jpg'),
          title: 'Holiday special event starts!',
          subtitle: 'A new special pauper event starts and it has free entry.',
          details: 'The event Rewards are promo Llanowar Elves and Firemind\'s Research.',
          date: '2018-12-24 00:00',
          link: '/holiday_2018'
        },
        {
          cover: require('@/assets/pages-headers/Healers-Hawk.jpg'),
          title: 'Exploring MTG Lotus Valley Decks',
          subtitle: 'A little tour by public and private decks page\'s features.',
          details: 'Check the differences between public and private decks.',
          date: '2018-12-16 00:00',
          link: '/mtglv_decks'
        },
        {
          cover: require('@/assets/pages-headers/League-guildmage.jpg'),
          title: 'Announcing MTG Arena deck tracker Lotus Tracker!',
          subtitle: 'Play MTG Arena with a deck overlay and sync your data and matches with Mtg Lotus Valley.',
          details: 'Keep all your game data synchronized to easily access anytime.',
          date: '2018-12-15 00:00',
          link: '/lotustracker'
        },
        {
          cover: require('@/assets/pages-headers/EmmaraSoulOfTheAccord.jpg'),
          title: 'Announcing MTG Lotus Valley!',
          subtitle: 'What\'s the purpose of this site? What it offer to MTGA players?',
          details: 'Track your MTGA data, share Decks and analyse the Meta.',
          date: '2018-12-14 00:00',
          link: '/mtglv'
        }
      ]
    }
  },
  methods: {
    getDaysAgo: function (days) {
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date.getUTCFullYear() + '-' +
          (`0${date.getUTCMonth() + 1}`).slice(-2) + '-' +
          (`0${date.getUTCDate()}`).slice(-2)
    },
    requestDeckOfDay: function () {
      this.$api.getDeckOfDay(this.getDaysAgo(1), 'Constructed')
        .then(res => {
          this.deckOfDayCards = res.data.cards
          this.deckOfDayName = `${res.data.name} | ${res.data.wins}-${res.data.losses} (${res.data.winRate}%)`
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestDeckByColorsBasics: function () {
      this.$api.getDecksByColors(this.getDaysAgo(8), this.getDaysAgo(1), true)
        .then(res => {
          this.decksByColorsBasics = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .mostPlayedCards {
    min-width: 280px;
  }
  .ta-l {
    text-align: left;
  }
  .news {
    text-decoration: none;
  }
  .newsContainer {
    min-height: 600px;
  }
</style>
