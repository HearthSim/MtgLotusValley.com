  <template>
    <v-layout row wrap>
      <v-flex xs12>
        <!-- <Events/> -->
      </v-flex>
      <v-flex xs12>
        <v-layout class="box" row wrap>
          <v-flex xs12 class="boxHeader">Latest Constructed Decks</v-flex>
          <v-layout class="boxContent" row wrap>
            <LatestDecks />
          </v-layout>
        </v-layout>
      </v-flex>
      <v-layout row wrap>
        <v-flex sm12 md8>
          <v-layout :class="`box mt-0 ${$vuetify.breakpoint.smAndDown ? '' : 'mr-0'}`" row wrap>
            <v-flex xs12 class="boxHeader">News</v-flex>
            <v-layout class="boxContent newsContainer mt-0" row wrap>

              <router-link v-for="(news, index) in latestNews" v-bind:key="index"
                class="news mt-3" :to="news.link">
                <v-card class="pt-1 pl-1 pr-1">
                  <img :src="news.cover" width="100%"/>
                  <v-layout class="mt-2 ml-3 mr-3" row nowrap>
                    <span class="title deep-orange--text text--lighten-1 font-weight-bold">{{news.title}}</span>
                  </v-layout>
                  <v-layout class="mt-2 ml-3 mr-3 pb-3" row nowrap>
                    <v-layout class="text-xs-left" column nowrap>
                      <span class="body-1 pr-3">{{news.subtitle}}</span>
                      <v-layout row justify-center class="text-xs-right hidden-sm-and-up">
                        <span class="mr-1 subtitle font-weight-bold">
                          {{ new Date(news.date).toLocaleString().split(' ')[0].replace(',', '') }}
                        </span>
                      </v-layout>
                    </v-layout>
                    <v-spacer/>
                    <v-layout row justify-center class="hidden-xs-only">
                      <span class="mr-1 subtitle font-weight-bold">
                        {{ new Date(news.date).toLocaleString().split(' ')[0].replace(',', '') }}
                      </span>
                    </v-layout>
                  </v-layout>
                </v-card>
              </router-link>

            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex sm12 md4>
          <v-layout class="box mt-0 pb-2" row wrap>
            <v-flex xs12 class="boxHeader">Colors Distribution (Last 7 days)</v-flex>
            <v-layout class="boxContent" row nowrap>
              <div class="m-auto">
                <DecksColorDistribution :colors="decksByColorsBasics"
                  :showTitle="false" :height="250" :width="250"/>
              </div>
            </v-layout>
          </v-layout>
          <v-layout class="box mt-0" row wrap>
            <v-flex xs12 class="boxHeader">Deck of Day</v-flex>
            <v-layout class="boxContent" row wrap>
              <Deck class="mt-2 mb-2 m-auto" :cards="deckOfDayCards"
                :name="deckOfDayName" :details="deckOfDayDetails" :link="true"/>
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
  head: {
    title: {
      inner: 'Lotus Valley'
    },
    meta: [
      { p: 'og:title', c: 'Lotus Valley' },
      { p: 'og:image', c: require('@/assets/pages-headers/LeagueGuildmage.jpg') }
    ]
  },
  data () {
    return {
      deckOfDayName: '',
      deckOfDayDetails: '',
      deckOfDayCards: {},
      decksByColorsBasics: {},
      latestNews: [
        {
          cover: require('@/assets/pages-headers/HealersHawk.jpg'),
          title: 'Lotus Tracker being discontinued on July, 2020',
          subtitle: 'Thank you to all Lotus Tracker users.',
          date: '2020-06-30 00:00',
          link: '/goodbye'
        },
        {
          cover: require('@/assets/pages-headers/SparkDouble.jpg'),
          title: 'Lotus Valley is joining forces with HearthSim!',
          subtitle: 'Working together we can do more for all MTGA players.',
          date: '2019-05-02 00:00',
          link: '/hearthsim'
        },
        {
          cover: require('@/assets/pages-headers/ArchwayAngel.jpg'),
          title: 'MTGA January update, duplicate protections is here!',
          subtitle: 'The first update from 2019 brings Ravnica Allegiance Set, Duplicate protection and more.',
          date: '2019-01-14 00:00',
          link: '/january_2019_update'
        },
        {
          cover: require('@/assets/pages-headers/RatColony.jpg'),
          title: 'Pauper analysis after first week of Holiday event',
          subtitle: 'After one week of Pauper format in Holiday event, here some analysis of what was going.',
          date: '2018-12-31 00:00',
          link: '/holiday_2018_analysis'
        },
        {
          cover: require('@/assets/pages-headers/Mountain1.jpg'),
          title: 'Holiday special event starts!',
          subtitle: 'A new special pauper event starts and it has free entry. The event Rewards are promo Llanowar Elves and Firemind\'s Research.',
          date: '2018-12-24 00:00',
          link: '/holiday_2018'
        },
        {
          cover: require('@/assets/pages-headers/HealersHawk.jpg'),
          title: 'Exploring MTG Lotus Valley Decks',
          subtitle: 'A little tour by public and private decks page\'s features. Check the differences between public and private decks.',
          date: '2018-12-16 00:00',
          link: '/mtglv_decks'
        },
        {
          cover: require('@/assets/pages-headers/LeagueGuildmage.jpg'),
          title: 'Announcing MTG Arena deck tracker Lotus Tracker!',
          subtitle: 'Play MTG Arena with a deck overlay and sync your data and matches with Mtg Lotus Valley. Keep all your game data synchronized to easily access anytime.',
          date: '2018-12-15 00:00',
          link: '/lotustracker'
        },
        {
          cover: require('@/assets/pages-headers/EmmaraSoulOfTheAccord.jpg'),
          title: 'Announcing MTG Lotus Valley!',
          subtitle: 'What\'s the purpose of this site? What it offer to MTGA players? Track your MTGA data, share Decks and analyse the Meta.',
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
          this.deckOfDayName = res.data.name
          this.deckOfDayDetails = `${res.data.wins}-${res.data.losses} (${res.data.winRate}%)`
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
