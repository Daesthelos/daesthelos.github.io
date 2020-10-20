<template>
  <div>Hello error</div>
</template>
<script>
export default {
    validate({params}) {
        return false
    }
}
</script>