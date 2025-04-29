import { createRouter, createWebHistory } from 'vue-router'
import OverviewHome from '../views/OverviewHome.vue'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/', name: 'Current', 
            component: OverviewHome,
            props: true,
        },
        {
            path: '/hourly-forecast', name: 'Hourly Forecast', 
            component: () => import(/* webpackChunkName: 'HourlyForecast' */ '../views/HourlyForecast.vue'),
            props: true
        },
        {
            path: '/5-day-forecast', name: '5 Day Forecast',
            component: () => import(/* webpackChunkName: '5DayForecast' */ '../views/5DayForecast.vue'),
            props: true
        },
    ],
    linkActiveClass: 'active-link'
})

export default router;