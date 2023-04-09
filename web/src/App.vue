<template>
    <router-view/>
</template>
<script>
  console.log(window.location.hostname+":"+window.location.port)
</script>

<style>
  html,body,#app{
    margin: 0px;
    padding: 0px;
    height:100%;
    padding-right: 0 !important;
  }
</style>
