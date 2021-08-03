import Vue from 'vue'
import { getCurrentInstance } from '@vue/composition-api'
import RawRouter, { NavigationGuard, Route, RouterOptions } from 'vue-router'
import { OUT_OF_SCOPE, warn } from './utils'


export interface VueRouter extends RawRouter {
    isReady: () => Promise<void>
}

// @ts-ignore
RawRouter.prototype.isReady = function () {
    return new Promise((resolve, reject) => {
        this.onReady(resolve, reject);
    });
}


export function createRouter(options: RouterOptions) {
    Vue.use(RawRouter)
    return new RawRouter(options) as VueRouter
}


export function useRouter() {
    const inst = getCurrentInstance()
    if (inst) {
        return inst.proxy.$router as VueRouter
    } else {
        warn(OUT_OF_SCOPE)
    }
}

export function useRoute() {
    const inst = getCurrentInstance()
    if (inst) {
        return inst.proxy.$route as Route
    } else {
        warn(OUT_OF_SCOPE)
    }
}


export function onBeforeRouteLeave(leaveGuard: NavigationGuard) {
    const inst = getCurrentInstance()
    if (!inst) {
        warn(OUT_OF_SCOPE)
        return
    }
    const { options } = inst.proxy.constructor as any
    const hooks: any = options.beforeRouteLeave || []
    hooks.push(leaveGuard)
    options.beforeRouteLeave = hooks
}

export function onBeforeRouteUpdate(updateGuard: NavigationGuard) {
    const inst = getCurrentInstance()
    if (!inst) {
        warn(OUT_OF_SCOPE)
        return
    }
    const { options } = inst.proxy.constructor as any
    const hooks: any = options.beforeRouteUpdate || []
    hooks.push(updateGuard)
    options.beforeRouteUpdate = hooks
}
