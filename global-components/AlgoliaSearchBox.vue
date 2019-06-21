<template>
  <form class="search-form">
    <s-input
      placeholder="Search documentation"
      id="algolia-search-input"
      :icon-left="['s-icon', { icon: 'search'}]"
    />
  </form>
</template>

<script>
export default {
  props: ['options'],
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      Promise.all([
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.js'),
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.css')
      ]).then(([docsearch]) => {
        docsearch = docsearch.default
        docsearch(Object.assign(this.options, {
          debug: true,
          inputSelector: '#algolia-search-input input'
        }))
      })
    }
  },
  watch: {
    options (newValue) {
      this.$el.innerHTML = '<input: id="algolia-search-input" class="search-query input">';
      this.initialize(newValue)
    }
  }
}
</script>
