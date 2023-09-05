<template>
  <el-container direction="vertical">
    <top-header></top-header>
    <router-view></router-view>
  </el-container>
</template>

<script>
export default {
  components: {
    topHeader: import("@/components/topHeader.vue")
  },
  methods: {

  },
  mounted() {
  }
}
</script>

<style>
html,
body {
  margin: 0px;
  padding: 0px;
  overflow: visible;
  --el-color-primary: orange !important;
  --bs-link-color: orange;
  --el-color-primary-light-9: #fffaec;
}

::-webkit-scrollbar {
  display: none;
}

a {
  text-decoration: none !important;
}
</style>
