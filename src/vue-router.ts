import Vue from 'vue'
import { computed, ComputedRef, getCurrentInstance, reactive, shallowRef, effectScope } from '@vue/composition-api'
import VueRouter, { NavigationGuard, Route, RouterOptions } from 'vue-router'
import { OUT_OF_SCOPE, warn } from './utils'


export {
    RouteMeta,
    RouterOptions,
    RouteRecord,
    RouteConfig as RouteRecordRaw,
    RedirectOption as RouteRecordRedirectOption,
    RawLocation as RouteLocationRaw,
} from 'vue-router'
export type RouteRecordName = string | symbol
export type RouterScrollBehavior = RouterOptions['scrollBehavior']
export type RouteLocationNormalized = Route
export type RouteLocationNormalizedLoaded = Route


export interface Router extends VueRouter {
    isReady: () => Promise<void>

    /** @deprecated */
    app: VueRouter['app']

    /** @deprecated */
    getMatchedComponents: VueRouter['getMatchedComponents']

    /** @deprecated use `isReady` instead */
    onReady: VueRouter['onReady']
}


// @ts-ignore
VueRouter.prototype.isReady = function () {
    return new Promise((resolve, reject) => {
        this.onReady(resolve, reject)
    })
}


export function createRouter(options: RouterOptions) {
    Vue.use(VueRouter)
    return new VueRouter(options) as Router
}


export function useRouter(): Router {
    const inst = getCurrentInstance()
    if (inst) {
        return inst.proxy.$router as Router
    }
    warn(OUT_OF_SCOPE)
    return undefined as any
}


let currentRoute: RouteLocationNormalizedLoaded

export function useRoute() {
    if (!currentRoute) {
        const router = useRouter()
        const scope = effectScope(true)
        scope.run(()=> {
            const routeRef = shallowRef(router.currentRoute);
            const computedRoute = {} as {
                [key in keyof Route]: ComputedRef<Route[key]>
            }
            for (const key of Object.keys(routeRef.value) as (keyof Route)[]) {
                computedRoute[key] = computed<any>(() => routeRef.value[key])
            }
            router.afterEach(to => routeRef.value = to)
            currentRoute = reactive(computedRoute)
        })
    }
    return currentRoute
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
