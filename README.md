# Vue 2 Helpers
A util package to use Vue 2 with Composition API easily.


## ⬇️ Install
```
npm i -S vue2-helpers
```


## 📃 API
### vue2-helpers
|Declaration|Description|
|-|-|
|createVuexHelpers&lt;<br>&nbsp;&nbsp;RootState, RootGetters, RootMutations, RootActions<br>&gt;(): { useState,  useGetters, useMutations, useActions }||

### vue2-helpers/vuex
|Declaration|Description|
|-|-|
|createStore&lt;S&gt;(options: StoreOptions&lt;S&gt;): Store&lt;S&gt;||
|useStore&lt;S = any&gt;(): Store&lt;S&gt; \| undefined||

### vue2-helpers/vue-router
|Declaration|Description|
|-|-|
|createRouter(options: RouterOptions): VueRouter||
|useRouter(): VueRouter \| undefined||
|useRoute(): Route \| undefined||
|onBeforeRouteLeave(leaveGuard: NavigationGuard): void||
|onBeforeRouteUpdate(updateGuard: NavigationGuard): void||
