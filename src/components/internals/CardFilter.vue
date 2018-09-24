<template>
  <v-card class="pt-2 pl-2 pr-2 pb-2">
    <div id="colors">
      <img src="@/assets/mana_white.png" alt="White"/>
      <img src="@/assets/mana_blue.png" alt="Blue"/>
      <img src="@/assets/mana_black.png" alt="Black"/>
      <img src="@/assets/mana_red.png" alt="Red"/>
      <img src="@/assets/mana_green.png" alt="Green"/>
      <img src="@/assets/mana_gold.png" alt="Gold"/>
      <img src="@/assets/mana_colorless.png" alt="Colorless"/>
    </div>
    <div id="types" class="pl-2 pr-2">
      <img src="@/assets/type_land.png" alt="Lands"/>
      <img src="@/assets/type_creature.png" alt="Creatures"/>
      <img src="@/assets/type_instant.png" alt="Instants"/>
      <img src="@/assets/type_sorcery.png" alt="Sorceries"/>
      <img src="@/assets/type_enchantment.png" alt="Enchantments"/>
      <img src="@/assets/type_artifact.png" alt="Artifacts"/>
      <img src="@/assets/type_planeswalker.png" alt="Planeswalkers"/>
    </div>
    <div id="sets" class="pl-2 pr-2">
      <v-menu bottom transition="slide-y-transition">
        <strong flat slot="activator">
            Sets
        </strong>
        <v-list>
          <v-list-tile v-for="(set) in sets" :key="set.code" @click="setClick(set.code)">
            <img class="set" :src="require(`@/assets/set_${set.code}.png`)" :alt="set.name"/>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </v-card>
</template>

<script>

export default {
  name: 'CardFilter',
  mounted () {
    
  },
  data () {
    return {
      activeColors: [],
      activeTypes: [],
      activeSets: [],
      sets: [
        {code: 'M19', name: 'Core Set 2019'},
        {code: 'DAR', name: 'Dominaria'},
        {code: 'RIX', name: 'Rivals of Ixalan'},
        {code: 'XLN', name: 'Ixalan'},
        {code: 'HOU', name: 'Hour of Devastation'},
        {code: 'AKH', name: 'Amonkhet'},
        {code: 'AER', name: 'Aether Revolt'},
        {code: 'KLD', name: 'Kaladesh'}
      ]
    }
  },
  methods: {
    setClick: function (code) {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #colors, #types {
    border: solid 1px lightgray;
    border-radius: 8px;
    height: 36px;
    display: inline-block;
    text-align: center;
  }
  #sets {
    border: solid 1px lightgray;
    border-radius: 8px;
    height: 36px;
    text-align: center;
  }
  #colors img, #types img {
    padding: 3px;
    height: 100%;
    vertical-align: sub;
  }
  .set {
    height: 24px;
  }
  #colors img:hover, #types img:hover {
    background: lightgray
  }
</style>
