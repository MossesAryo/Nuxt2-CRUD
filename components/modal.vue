<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ title   }}</h2>
      <slot></slot>
      <div class="actions">
        <button class="btn-cancel" @click="close">Batal</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: "Modal" }
  },
  methods: {
    close() {
      this.$emit("close")
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: #fff;
  padding: 20px;
  width: 450px;
  max-width: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.actions {
  margin-top: 16px;
  text-align: right;
}

.btn-cancel {
  padding: 6px 12px;
  background: #9ca3af;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #6b7280;
}
</style>
