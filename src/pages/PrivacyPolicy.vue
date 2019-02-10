<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="title">Privacy Policy</span>
          <span class="body-1 mt-3">
            This website and Lotus Tracker are complementary tools created by Édipo Souza and as an open source project 
            that can also receive updates and fixes by community. This service and tool are provided at no cost is intended 
            for use as is.
          </span>
          <span class="body-1 mt-2">
            To make reading easier, when we need to refer both, {{website}} and Lotus Tracker in this document, 
            the word Lotus project will be used.

            This document can be updated as we provide new features and website or Lotus Tracker. Users will be notified 
            when a updated version comes online.
          </span>
          <span class="body-1 mt-2">
            As we use Google Analytics tools on Lotus project for collect usage data, users also need agree with its 
            <a href="https://www.google.com/analytics/terms/us.html" target="_blank">terms</a>.
          </span>
          <span class="title mt-4">Content</span>
          <span class="body-1 mt-3">
            To be able to provide the main features, Lotus Tracker tracks game data from MTG Arena while users are playing 
            and upload it to {{website}} as anonymous data and/or as user private data. 
          </span>
          <ul class="mt-1">
            <li class="mt-2">
              <span class="subheading font-weight-bold mt-3">Anonymous Data</span><br/>
              <span class="body-1">Users are not required to do create an account on Lotus project, Lotus Tracker can be used 
                with some limitation without an account if user are interested only in ingame overlay feature. In this case, 
                match data will still be collected and uploaded but without user identifications, like ids or username. 
                Any other data mentioned in User Data section will not be collected.</span>
            </li>
            <li class="mt-2">
              <span class="subheading font-weight-bold mt-3">User Data</span><br/>
              <span class="body-1">Once users create an account and do a login on Lotus Tracker, personal game data are uploaded 
                so users will be able to see it on {{website}}. Personal game data is exclusively to its owner, 
                any other user will not be able to see it. The following personal game data will be collected:</span>
              <ul class="mt-2">
                <li>User game username</li>
                <li>User inventory (gold, gems, vault progress)</li>
                <li>User collection</li>
                <li>User decks</li>
                <li>User matches</li>
                <li>User events result</li>
              </ul>
            </li>
          </ul>
          <span class="title mt-4">Security</span>
          <span class="body-1 mt-3">Users private data will never be shared or sold to any third parties.</span>
          <span class="title mt-4">Shared Data</span>
          <span class="body-1 mt-3">The only data that can be shared by Lotus project is Anonymous data, in other words, 
                just matches info without identify the players. User are still be able to share his decks by publishing it, 
                so this way, they will be available to anyone see it on {{website}}.</span>
          <span class="title mt-4">Storage</span>
          <span class="body-1 mt-3">Lotus Tracker don't store data locally, all Lotus project data are stored on server.</span>
          <ul class="mt-3">
            <li class="mt-1">
              <span class="subheading font-weight-bold mt-3">Availability</span><br/>
              <i class="body-1">Using {{website}}, all data can be accessed as public data provided by anonymous match uploads, 
                and as well as private data once user is logged on website.</i>
            </li>
            <li class="mt-2">
              <span class="subheading font-weight-bold mt-3">Your data is yours!</span><br/>
              <i class="body-1">Users will, later, be able to download all his data from his profile page once logged. 
                They will also be able to download anonymous data if they want to analyse it in some way that {{website}} 
                isn't doing yet.</i>
            </li>
          </ul>
          <span class="title mt-4">Contact</span>
          <span class="body-1 mt-3">If you have any questions or suggestions about this Privacy Policy, 
            do not hesitate to contact me at mtglotusvalley@gmail.com.</span>
        </v-layout>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>

export default {
  name: 'PrivacyPolicy',
  data () {
    return {
      website: 'www.mtglotusvalley.com'
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
</style>
