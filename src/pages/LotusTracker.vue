<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <v-btn class="download-windows" round color="deep-orange" :href="lotusTrackerWindows">
          <v-icon color="white">get_app</v-icon>
          <span class="white--text font-weight-bold">Download for Win</span>
        </v-btn>
        <v-btn class="download-osx" round color="deep-orange" :href="lotusTrackerOSX">
          <v-icon color="white">get_app</v-icon>
          <span class="white--text font-weight-bold">Download for Mac</span>
        </v-btn>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2018-12-15 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="title">About</span>
          <span class="body-1 mt-2">
            Lotus Tracker is a <a href="https://www.mtgarena.com" target="_blank">MTG Arena</a> deck tracker written
            in c++ using QT5. Based on sources of the Hearthstone deck tracker
            <a href="https://trackobot.com" target="_blank">Track-o-Bot</a> created by Steven Schmid,
            Lotus tracker is also an <a href="https://github.com/edipo2s/LotusTracker" target="_blank">open source</a>
            project allowing you to verify, study and contribute with the project.
          </span>
          <span class="title mt-4">Multiplatform</span>
          <span class="body-1 mt-2">
            Lotus Tracker was planned and developed thinking in both main desktop platforms. So the source code is
            ready to build for both <b>Windows</b> and <b>Mac OS</b> systems and as a <b>native</b> program, it will
            have a low memory and CPU usage.
          </span>
          <span class="title mt-4">Features</span>
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-layout class="mt-2_5" column wrap>
                <ul>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Basic features</span><br/>
                    <i class="caption">Tray-icon, Auto-Start with System, Auto-Update</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Player data sync</span><br/>
                    <i class="caption">Collection, Decks, Wildcards, Gold, Gems and Vault progress</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Player games sync</span><br/>
                    <i class="caption">Matches and Events result</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Player deck overlay</span><br/>
                    <i class="caption">Configurable to show/hide cards with 0 copies remaining. Also pos sideboard</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Player deck win rate</span><br/>
                    <i class="caption">For events, it also means the event's wins/losses</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Player deck with sideboard</span><br/>
                    <i class="caption">In Bo3 matches, show updated deck pos sideboarding</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Opponent cards overlay</span><br/>
                    <i class="caption">Based on cards used</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Opponent deck archetype</span><br/>
                    <i class="caption">Based on cards used</i>
                  </li>
                </ul>
              </v-layout>
            </v-flex>
            <v-flex class="pt-4" xs12 sm6>
              <a class="mt-2 ml-2" href="static/images/lotus_tracker_overlay.jpg" target="_blank">
                <img src="static/images/lotus_tracker_overlay.jpg" style="width: 100%;"/>
              </a>
            </v-flex>
          </v-layout>
          <v-layout class="mt-3" row wrap>
            <v-flex xs12 sm6>
              <v-layout class="mt-4" column nowrap>
                <ul>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Configurable zoom</span><br/>
                    <i class="caption">5 levels</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Collapse/Expand overlay</span><br/>
                    <i class="caption">On mouse right click</i><br/>
                    <i class="caption">Configurable collapsed duration</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Configurable overlay cards layout</span><br/>
                    <i class="caption">Magic Arena card and Magic the Gathering layouts</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Configurable overlay opacity</span><br/>
                    <i class="caption">For both player and opponent overlay</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Configurable deck remaining cards</span><br/>
                    <i class="caption">Show/Hide deck cards with 0 copies on deck</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Hide when tabbing MTGA</span><br/>
                    <i class="caption">Auto-Hide when game lose focus</i>
                  </li>
                </ul>
              </v-layout>
            </v-flex>
            <v-flex class="pt-2" xs12 sm6>
              <a href="static/images/lotus_tracker_preferences.jpg" target="_blank">
                <img class="mt-2" src="static/images/lotus_tracker_preferences.jpg" style="width: 100%;"/>
              </a>
            </v-flex>
          </v-layout>
          <v-layout class="mt-4" row wrap>
            <v-flex xs12 sm6>
              <v-layout class="mt-4" column nowrap>
                <ul>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Player draw statistics</span><br/>
                    <i class="caption">Percent chances to draw a land or card by remaining qtd</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Show card image</span><br/>
                    <i class="caption">On mouse Hover</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Draft Helper</span><br/>
                    <i class="caption">Show card tiers while drafting</i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">LSV Draft Tiers</span><br/>
                    <i class="caption">Cards ranks and commentary by LSV from <a href="https://www.channelfireball.com/tag/limited-set-review/">ChannelFireball.com</a></i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">DraftSim Draft Tiers</span><br/>
                    <i class="caption">Cards ranks by Dan from <a href="https://draftsim.com/">Draftsim.com</a></i>
                  </li>
                  <li>
                    <span class="subheading font-weight-bold mt-3">Collection Info</span><br/>
                    <i class="caption">Show card quantity in collection (x/4)</i>
                  </li>
                </ul>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm6>
              <a href="static/images/lotus_tracker_draft.jpg" target="_blank">
                <img class="mt-2" src="static/images/lotus_tracker_draft.jpg" style="heigth: 100%;"/>
              </a>
            </v-flex>
          </v-layout>
          <v-layout class="mt-5" row nowrap>
            <v-spacer/>
            <span class="subheading">Checkout Lotus Valley features <a href="/mtglv">here</a></span>
            <v-spacer/>
          </v-layout>
          <v-layout class="mt-3" row nowrap>
            <v-spacer/>
            <span class="subheading">Download now for <a :href="lotusTrackerWindows">Windows</a></span>
            <v-spacer/>
          </v-layout>
        </v-layout>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>

import VueMarkdown from 'vue-markdown'

export default {
  name: 'LotusTracker',
  components: {
    VueMarkdown
  },
  data () {
    return {
      lotusTrackerWindows: 'https://github.com/MtgLotusValley/LotusTracker/releases/download/v1.2.5/Lotus.Tracker.1.2.5.zip',
      lotusTrackerOSX: 'https://github.com/MtgLotusValley/LotusTracker/releases/download/v1.2.5/LotusTracker_1.2.5.dmg'
    }
  },
  created () {
    this.$scrollToTop()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-bg {
    background-image: url('~@/assets/pages-headers/LeagueGuildmage.jpg');
    height: 250px !important;
    position: relative;
  }
  .date {
    position: absolute;
    left: calc(100% - 145px);
    top: calc(100% - 40px);
  }
  .download-windows {
    position: absolute;
    left: calc(100% - 240px);
    top: 8px;
  }
  .download-osx {
    position: absolute;
    left: calc(100% - 240px);
    top: 60px;
  }
</style>
