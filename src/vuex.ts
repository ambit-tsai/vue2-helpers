import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import { getCurrentInstance } from '@vue/composition-api'
import { OUT_OF_SCOPE, warn } from './utils'


export function createStore<S>(options: StoreOptions<S>) {
    Vue.use(Vuex)
    return new Store<S>(options)
}

    
export function useStore<S = any>() {
    const inst = getCurrentInstance()
    if (inst) {
        return inst.proxy.$store as Store<S>
    } else {
        warn(OUT_OF_SCOPE)
    }
}
