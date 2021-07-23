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
|createVuexHelpers&lt;<br>&nbsp;&nbsp;&nbsp;&nbsp;RootState, RootGetters, RootMutations, RootActions<br>&gt;(): {<br>&nbsp;&nbsp;&nbsp;&nbsp;useState, useGetters, useMutations, useActions<br>}|The usage of `useState` is the same as `mapActions` |

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


## ☎️ Contact
1. WeChat: ambit_tsai
1. QQ Group: 663286147
1. E-mail: ambit_tsai@qq.com
