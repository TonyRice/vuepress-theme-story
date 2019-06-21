<script>
import { isActive, hashRE, groupHeaders } from '../util'

export default {
  functional: true,
  props: ['item'],
  render (h, { parent: { $page, $site, $route }, props: { item }}) {
    // use custom active class matching logic
    // due to edge case of paths ending with / + hash
    const selfActive = isActive($route, item.path)
    // for sidebar: auto pages, a hash link should be active if one of its child
    // matches
    const active = item.type === 'auto'
      ? selfActive || item.children.some(c => isActive($route, item.basePath + '#' + c.slug))
      : selfActive
    const link = renderLink(h, item.path, item.title || item.path, item.icon, active)
    const configDepth = $page.frontmatter.sidebarDepth != null
      ? $page.frontmatter.sidebarDepth
      : $site.themeConfig.sidebarDepth
    const maxDepth = configDepth == null ? 1 : configDepth
    if (item.type === 'auto') {
      return [link, renderChildren(h, item.children, item.basePath, $route, maxDepth)]
    } else if (active && item.headers && !hashRE.test(item.path)) {
      const children = groupHeaders(item.headers)
      return [link, renderChildren(h, children, item.path, $route, maxDepth)]
    } else {
      return link
    }
  }
}

function renderLink (h, to, text, icon, active) {
  return h('router-link', {
    props: {
      to,
      activeClass: '',
      exactActiveClass: ''
    },
    class: {
      active,
      'sidebar-link': true
    }
  }, icon ? [h('sidebar-icon', { props: { name: icon } }), h('span', text)] : text)
}

function renderChildren (h, children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null
  return h('ul', { class: 'sidebar-sub-headers' }, children.map(c => {
    const active = isActive(route, path + '#' + c.slug)
    return h('li', { class: 'sidebar-sub-header' }, [
      renderLink(h, '#' + c.slug, c.title, c.icon, active),
      renderChildren(h, c.children, path, route, maxDepth, depth + 1)
    ])
  }))
}
</script>

