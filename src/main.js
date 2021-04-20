import Vue from 'vue';
import App from './App.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Menubar from 'primevue/menubar';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import TabMenu from 'primevue/tabmenu';
import router from './router';
import InputMask from 'primevue/inputmask';
import SelectButton from 'primevue/selectbutton';
import Panel from 'primevue/panel';
import Chart from 'primevue/chart';
import Card from 'primevue/card';
import Tooltip from 'primevue/tooltip';
import OrderList from 'primevue/orderlist';
import Password from 'primevue/password';
import Fieldset from 'primevue/fieldset';

Vue.use(ToastService);
Vue.use(Chart);
Vue.directive('tooltip', Tooltip);

import 'primevue/resources/themes/mdc-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primevue/resources/primevue.min.css';
import '../src/assets/css/principal.css';

Vue.config.productionTip = false;

Vue.component('Fieldset', Fieldset);
Vue.component('DataTable', DataTable);
Vue.component('Column', Column);
Vue.component('Menubar', Menubar);
Vue.component('Dialog', Dialog);
Vue.component('InputText', InputText);
Vue.component('ColumnGroup', ColumnGroup);
Vue.component('Button', Button);
Vue.component('Toast', Toast);
Vue.component('Dropdown', Dropdown);
Vue.component('Calendar', Calendar);
Vue.component('InputNumber', InputNumber);
Vue.component('TabMenu', TabMenu);
Vue.component('InputMask', InputMask);
Vue.component('SelectButton', SelectButton);
Vue.component('Panel', Panel);
Vue.component('Chart', Chart);
Vue.component('Card', Card);
Vue.component('OrderList', OrderList);
Vue.component('Password', Password);

new Vue({
    directives: {
        tooltip: Tooltip
    },

    router,
    render: (h) => h(App)
}).$mount('#app');
