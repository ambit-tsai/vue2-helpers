import Vue from 'vue';
import {
    effectScope,
    getCurrentInstance,
    reactive,
} from '@vue/composition-api';
import VueRouter, {
    NavigationGuard,
    Route,
    RouterOptions,
    RouteConfig as RouteRecordRaw,
} from 'vue-router';
import { OUT_OF_SCOPE, warn } from './utils';

export { RouteRecordRaw };
export {
    RouteMeta,
    RouterOptions,
    RouteRecord,
    RedirectOption as RouteRecordRedirectOption,
    RawLocation as RouteLocationRaw,
} from 'vue-router';
export type RouteRecordName = string | symbol;
export type RouterScrollBehavior = RouterOptions['scrollBehavior'];
export type RouteLocationNormalized = Route;
export type RouteLocationNormalizedLoaded = Route;

export interface Router extends VueRouter {
    isReady(): Promise<void>;

    /** @deprecated */
    app: VueRouter['app'];

    /** @deprecated use `currentRoute.matched` instead */
    getMatchedComponents: VueRouter['getMatchedComponents'];

    /** @deprecated use `isReady` instead */
    onReady: VueRouter['onReady'];

    routes: RouteRecordRaw[];
}

// @ts-ignore
VueRouter.prototype.isReady = function () {
    return new Promise((resolve, reject) => {
        this.onReady(resolve, reject);
    });
};

export function createRouter(options: RouterOptions) {
    Vue.use(VueRouter);
    return new VueRouter(options) as Router;
}

export function useRouter(): Router {
    const inst = getCurrentInstance();
    if (inst) {
        return inst.proxy.$router as Router;
    }
    warn(OUT_OF_SCOPE);
    return undefined as any;
}

let currentRoute: Route;

export function useRoute() {
    const inst = getCurrentInstance();
    if (!inst) {
        warn(OUT_OF_SCOPE);
        return undefined as any;
    }
    if (!currentRoute) {
        const scope = effectScope(true);
        scope.run(() => {
            const { $router } = inst.proxy;
            currentRoute = reactive(assign({}, $router.currentRoute)) as any;
            $router.afterEach((to) => {
                assign(currentRoute, to);
            });
        });
    }
    return currentRoute;
}

function assign(target: Record<string, any>, source: Record<string, any>) {
    for (const key of Object.keys(source)) {
        target[key] = source[key];
    }
    return target;
}

export function onBeforeRouteLeave(leaveGuard: NavigationGuard) {
    const inst = getCurrentInstance();
    if (!inst) {
        warn(OUT_OF_SCOPE);
        return;
    }
    const { options } = inst.proxy.constructor as any;
    const hooks: any = options.beforeRouteLeave || [];
    hooks.push(leaveGuard);
    options.beforeRouteLeave = hooks;
}

export function onBeforeRouteUpdate(updateGuard: NavigationGuard) {
    const inst = getCurrentInstance();
    if (!inst) {
        warn(OUT_OF_SCOPE);
        return;
    }
    const { options } = inst.proxy.constructor as any;
    const hooks: any = options.beforeRouteUpdate || [];
    hooks.push(updateGuard);
    options.beforeRouteUpdate = hooks;
}
