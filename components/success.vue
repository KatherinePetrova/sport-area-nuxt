<template>
  <b-modal v-model="show" hide-header hide-footer>
    <div class="success-main">
      <svg
        id="successAnimation"
        class="animated"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="7.5 7.5 55 55"
      >
        <path
          id="successAnimationResult"
          fill="#99ff66"
          d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"
        />
        <circle
          id="successAnimationCircle"
          cx="35"
          cy="35"
          r="24"
          stroke="#99ff66"
          stroke-width="2"
          stroke-linecap="round"
          fill="transparent"
        />
        <polyline
          id="successAnimationCheck"
          stroke="#99ff66"
          stroke-width="2"
          points="23 34 34 43 47 27"
          fill="transparent"
        />
      </svg>
    </div>
    <h2 style="text-align: center; color: #064482">Успех!</h2>
    <div class="text">{{ message }}</div>
  </b-modal>
</template>
<script>
export default {
  data() {
    return {
      show: false
    };
  },
  computed: {
    success() {
      return this.$store.state.success.show;
    },
    message() {
      return this.$store.state.success.message;
    }
  },
  watch: {
    success(newValue) {
      if (newValue != this.show) {
        this.show = newValue;
      }
    },
    show(newValue) {
      if (newValue != this.success) {
        this.$store.commit("setSuccess", { show: newValue });
      }
    }
  }
};
</script>

<style scoped lang="scss">
$circle-length: 151px;
$check-length: 36px;
.text {
  padding: 1em;
  color: #064482;

  white-space: pre-wrap;
}

.success-main {
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius: 50% !important;
  height: 10em;
  width: 10em;
  background-color: #33cc33;

  margin: 0 auto;
}

@keyframes scaleAnimation {
  0% {
    opacity: 0;
    transform: scale(1.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes drawCircle {
  0% {
    stroke-dashoffset: $circle-length;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes drawCheck {
  0% {
    stroke-dashoffset: $check-length;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#successAnimationCircle {
  stroke-dasharray: $circle-length $circle-length;
  stroke: #fff;
}

#successAnimationCheck {
  stroke-dasharray: $check-length $check-length;
  stroke: #fff;
}

#successAnimationResult {
  fill: #fff;
  opacity: 0;
}

#successAnimation.animated {
  animation: 1s ease-out 0s 1 both scaleAnimation;

  #successAnimationCircle {
    animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both drawCircle,
      0.3s linear 0.9s 1 both fadeOut;
  }

  #successAnimationCheck {
    animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both drawCheck,
      0.3s linear 0.9s 1 both fadeOut;
  }

  #successAnimationResult {
    animation: 0.3s linear 0.9s both fadeIn;
  }
}
</style>
