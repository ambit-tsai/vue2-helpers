import Vue, { getCurrentInstance } from 'vue';
import Vuex, { Store, StoreOptions } from 'vuex';
import { OUT_OF_SCOPE, warn } from './utils';

export function createStore<S>(options: StoreOptions<S>) {
    Vue.use(Vuex);
    return new Store(options);
}

export function useStore<S = any>(): Store<S> {
    const inst = getCurrentInstance();
    if (inst) {
        return inst.proxy.$store;
    } else {
        warn(OUT_OF_SCOPE);
    }
    return undefined as any;
}
