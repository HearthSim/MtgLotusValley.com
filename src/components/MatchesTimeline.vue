<template>
  <v-timeline class="width100 ml-1 mr-2" align-top dense>
    <v-timeline-item v-for="(data, index) in matches" :key="index"
      :color="data.wins ? 'green' : 'red'" small :hide-dot="data.isHeader">
      <v-layout v-if="data.isHeader" row xs12>
        {{ data.dateFormatted }}
      </v-layout>

      <v-card v-if="!data.isHeader" class="mt-2 py-2">
        <v-layout row nowrap xs12>
          <v-flex xs2>
            <v-layout class="text-valign-center" column fill-height>
              <span class="ml-2">{{data.eventPublicName}}</span>
            </v-layout>
          </v-flex>
          <v-flex xs3>
            <v-layout class="text-xs-center" row nowrap fill-height>
              <v-layout class="text-valign-center" column>
                <router-link :to="`/user/decks/${data.deck}`">
                  <div class="pt-1 mana">
                    <img v-for="color in data.playerDeckColors.split('')" :key="color"
                      :src="require(`@/assets/mana/${color}.png`)"/>
                  </div>
                </router-link>
              </v-layout>
              <v-layout class="text-valign-center ml-2" column>
                <strong class="body-2">Vs</strong>
              </v-layout>
              <v-layout class="text-valign-center ml-2" column>
                <div class="pt-1 mana">
                  <img v-for="color in data.opponentDeckColors.split('')" :key="color"
                    :src="require(`@/assets/mana/${color}.png`)"/>
                </div>
              </v-layout>
            </v-layout>
          </v-flex>
          <v-flex xs3>
            <v-layout class="text-xs-center" row nowrap fill-height>
              <v-layout class="text-valign-center" column fill-height>
                  <span>{{data.opponentDeckArch}}</span>
              </v-layout>
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <v-layout class="text-xs-center" row nowrap fill-height>
              <v-layout class="text-valign-center" column>
                <span>{{data.opponentName}}</span>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>

export default {
  props: {
    matches: {
      type: Array,
      required: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .v-timeline {
    padding-top: 8px !important;
  }
  .v-timeline-item {
    padding-bottom: 8px !important;
  }
  .mana {
    min-width: 80px;
    white-space: nowrap;
  }
  .mana img {
    height: 20px;
    width: 20px;
  }
</style>
