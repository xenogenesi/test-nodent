import Test from './test'


// using 'vue' import vue.common.js by default and require isn't supported
//import Vue from '../../node_modules/vue/dist/vue';


/*new Vue({
    el: '#app',
    data: { message: 'Helloxxx Vue.js!' }
});*/


new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!'
    }
});

import App from '../vue/app.vue';

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App)
    }
});

var test = new Test();

var x = test.test('1234');

//xy();
