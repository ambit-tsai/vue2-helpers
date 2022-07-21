import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { ComputedRef, computed, getCurrentInstance } from 'vue';

type ActionReturnType<T extends (...args: any) => any> = Promise<
    T extends (...args: any) => Promise<infer U> ? U : ReturnType<T>
>;

interface ResultMap<T> {
    state: ComputedRef<T>;
    getters: ComputedRef<T extends (...args: any) => infer U ? U : never>;
    mutations: T extends (a: any) => any
        ? () => void
        : T extends (a: any, b: infer U) => any
        ? (payload: U) => void
        : never;
    actions: T extends (a: any) => any
        ? () => ActionReturnType<T>
        : T extends (a: any, b: infer U) => any
        ? (payload: U) => ActionReturnType<T>
        : never;
}

type ResultMapKey = keyof ResultMap<any>;

// TODO: 由于项目 TS 版本不支持 Template Literal Types，因此无法实现多层模块名 a/b/c 的推导
type HelperReturnType<RMK extends ResultMapKey, K extends string, Type> = {
    [key in K]: ResultMap<key extends keyof Type ? Type[key] : never>[RMK];
};

interface Helper<RMK extends ResultMapKey, RootType> {
    <K extends string>(keys: K[]): HelperReturnType<RMK, K, RootType>;

    <K extends string, N extends string>(
        namespace: N,
        keys: K[]
    ): HelperReturnType<RMK, K, N extends keyof RootType ? RootType[N] : {}>;

    <K extends string>(map: Record<K, string | Function>): HelperReturnType<
        RMK,
        K,
        RootType
    >;

    <K extends string, N extends string>(
        namespace: N,
        map: Record<K, string | Function>
    ): HelperReturnType<RMK, K, N extends keyof RootType ? RootType[N] : {}>;
}

export function createVuexHelpers<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
>() {
    return {
        useState: useState as Helper<'state', RootState>,
        useGetters: useGetters as Helper<'getters', RootGetters>,
        useMutations: useMutations as Helper<'mutations', RootMutations>,
        useActions: useActions as Helper<'actions', RootActions>,
    };
}

function useState(...args: [any]) {
    const states = mapState(...args);
    const result: any = {};
    Object.keys(states).forEach((key) => {
        result[key] = computed(states[key]);
    });
    return result;
}

function useGetters(...args: [any]) {
    const getters = mapGetters(...args);
    const result: any = {};
    Object.keys(getters).forEach((key) => {
        result[key] = computed(getters[key]);
    });
    return result;
}

function getVueInstance() {
    const vm = getCurrentInstance();
    if (vm) {
        return vm.proxy;
    }
    throw new Error('helper method only works during setup or Lifecycle Hooks');
}

function useMutations(...args: [any]) {
    const vm = getVueInstance();
    const result: any = {};
    const mutations = mapMutations(...args);
    Object.keys(mutations).forEach((key) => {
        result[key] = mutations[key].bind(vm);
    });
    return result;
}

function useActions(...args: [any]) {
    const vm = getVueInstance();
    const result: any = {};
    const actions = mapActions(...args);
    Object.keys(actions).forEach((key) => {
        result[key] = actions[key].bind(vm);
    });
    return result;
}
