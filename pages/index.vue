<template>
  <!-- <nuxt-link to="/user/">User</nuxt-link> -->
  <h1>Hello {{ pokemon.name }}</h1>
</template>
<script>
  import axios from "axios";

  //config
  export default {
    async asyncData({ params }) {
      try {
        const pokemon = await axios
          .get("https://pokeapi.co/api/v2/pokemon/151")
          .then((res) => res.data);
        return { pokemon };
      } catch (error) {
        console.log(error);
        return { pokemon: { name: error.message } };
      }
    },
    layout: "blog",
  };
</script>
