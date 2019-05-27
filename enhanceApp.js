import Story from '@storyscript/vue'

const vueCmps = require.context('./components', false, /\.vue$/)
const modules = {}

vueCmps.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.vue)/g, '')] = vueCmps(key).default
})

export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  Vue.directive('scroll', {
    inserted(el, binding) {
      const f = (evt) => {
        if (binding.value(evt, el)) {
          window.removeEventListener('scroll', f)
        }
      }
      window.addEventListener('scroll', f)
    }
  })
  for (let cmp in modules) {
    Vue.component(cmp, modules[cmp])
  }
  Vue.use(Story)
}