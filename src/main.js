// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import axios, {isCancel, AxiosError} from 'axios';
Vue.prototype.axios = axios;

import {date_format_fn} from "./functions/date_format.js";

import Vue from 'vue'
import App from './App.vue'

//import css from "./App.css";
require('@/App.css')

const configElement = document.getElementById( 'gantt_config' );
const config = JSON.parse( configElement.innerHTML );
Vue.prototype.config = config;

Vue.config.productionTip = false;

Vue.mixin({
  data() {
    return {
      date_format_fn: date_format_fn,
    };
  },
  methods: {
    not_empty: function (mix) {
      if (typeof mix == "undefined" || mix == "" || mix == 0 || mix == null) {
        return false;
      }
      if (typeof mix == "array") {
        if (mix.length < 1) {
          return false;
        }
      }
      if (typeof mix == "object") {
        if (JSON.stringify(mix) == "{}") {
          return false;
        }
      }
      return true;
    },
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
