import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import User from '@/pages/User'
//import Meta from '@/pages/Meta'
import DeckBuilder from '@/pages/DeckBuilder'
import UserCollection from '@/pages/UserCollection'
import PrivateDeckList from '@/pages/PrivateDeckList'
import PrivateDeck from '@/pages/PrivateDeck'
import PublicDeckList from '@/pages/PublicDeckList'
import PublicDeck from '@/pages/PublicDeck'
import LotusTracker from '@/pages/LotusTracker'
import PrivacyPolicy from '@/pages/PrivacyPolicy'

import NewsMtgLotusValley from '@/pages/news/1MtgLotusValley'
import NewsMtgLVDecks from '@/pages/news/2MtgLVDecks'
import NewsHoliday2018 from '@/pages/news/3Holiday2018'
import NewsHoliday2018Analysis from '@/pages/news/4Holiday2018Analysis'
import January2019Update from '@/pages/news/5January2019Update'
import HearthSim from '@/pages/news/6HearthSim'
import Depreciated from '@/pages/news/7Depreciated'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    // {
    //   path: '/meta',
    //   name: 'Meta',
    //   component: Meta
    // },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/user/collection',
      name: 'UserCollection',
      component: UserCollection,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/decks',
      name: 'PrivateDeckList',
      component: PrivateDeckList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/decks/:id/edit',
      name: 'DeckBuilderUserDeckEdit',
      component: DeckBuilder,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/decks/:id',
      name: 'PrivateDeck',
      component: PrivateDeck,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/decks/builder',
      name: 'DeckBuilder',
      component: DeckBuilder
    },
    {
      path: '/decks',
      name: 'PublicDeckList',
      component: PublicDeckList
    },
    {
      path: '/decks/:alias/edit',
      name: 'DeckBuilderPublicDeckEdit',
      component: DeckBuilder,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/decks/:alias',
      name: 'PublicDeck',
      component: PublicDeck
    },
    {
      path: '/lotustracker',
      name: 'LotusTracker',
      redirect: '/goodbye'
    },
    {
      path: '/privacypolicy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy
    },
    {
      path: '/mtglv',
      name: 'MtgLotusValley',
      component: NewsMtgLotusValley
    },
    {
      path: '/mtglv_decks',
      name: 'MtgLVDecks',
      component: NewsMtgLVDecks
    },
    {
      path: '/holiday_2018',
      name: 'NewsHoliday2018',
      component: NewsHoliday2018
    },
    {
      path: '/holiday_2018_analysis',
      name: 'NewsHoliday2018Analysis',
      component: NewsHoliday2018Analysis
    },
    {
      path: '/january_2019_update',
      name: 'January2019Update',
      component: January2019Update
    },
    {
      path: '/hearthsim',
      name: 'HearthSim',
      component: HearthSim
    },
    {
      path: '/goodbye',
      name: 'Depreciated',
      component: Depreciated
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = 'Mtg Lotus Valley'
  const currentUserId = localStorage.getItem('localId')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUserId) {
    next('/')
  } else {
    next()
  }
})

export default router
