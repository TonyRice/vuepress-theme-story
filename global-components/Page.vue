<template>
  <div class="page">
    <slot name="top" />
    <Content :custom="false" />
    <div
      class="content page-nav"
      v-if="prev || next"
    >
      <p class="inner">
        <span
          v-if="prev"
          class="prev"
        >
          <router-link
            v-if="prev"
            class="prev"
            :to="prev.path"
          >←
            {{ prev.title || prev.path }}
          </router-link>
        </span>
        <span
          v-if="next"
          class="next"
        >
          <router-link
            v-if="next"
            :to="next.path"
          >
            {{ next.title || next.path }} →
          </router-link>
        </span>
      </p>
    </div>
    <s-button
      link
      size="small"
      :url="{ href: editLink, target: '' }"
    >
      <s-icon
        icon="pen"
        :props="{ fill: '#5805fc', style: 'vertical-align:text-bottom' }"
      />
      {{ editLinkText }}
    </s-button>
    <slot name="bottom" />
  </div>
</template>

<script>
import { resolvePage, normalize, outboundRE, endingSlashRE } from '../util'

export default {
  props: ['sidebarItems'],
  computed: {
    prev () {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },
    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },
    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }

      if (docsRepo && editLinks) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : `https://github.com/${docsRepo}`
        return (
          base.replace(endingSlashRE, '') +
          `/edit/${docsBranch}` +
          (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
          path
        )
      }
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      )
    }
  }
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  items.forEach(item => {
    if (item.type === 'group') {
      res.push(...item.children || [])
    } else {
      res.push(item)
    }
  })
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === page.path) {
      return res[i + offset]
    }
  }
}
</script>
