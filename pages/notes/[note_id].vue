<template>
  <h1>{{ note_id }}</h1>
</template>
<script lang="ts" setup>
import {useRoute} from "vue-router";
const route = useRoute();
const note_id = route.params.note_id as string;
</script>
