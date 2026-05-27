<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">
        <span class="digit">4</span>
        <span class="digit zero">0</span>
        <span class="digit">4</span>
      </div>
      <div class="error-message">
        <h1>页面不见了</h1>
        <p>您访问的页面不存在或已被删除</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" @click="goHome">返回首页</button>
        <button class="btn btn-secondary" @click="goBack">返回上一页</button>
      </div>
    </div>
    <div class="background-decoration">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="floating-circle circle-4"></div>
      <div class="floating-circle circle-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const $router = useRouter()

const goHome = () => {
  $router.push('/home')
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    $router.push('/home')
  }
}
</script>

<style scoped lang="scss">
.not-found-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
  animation: float 8s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;
}

.circle-4 {
  width: 180px;
  height: 180px;
  top: 30%;
  right: 30%;
  animation-delay: 1s;
}

.circle-5 {
  width: 80px;
  height: 80px;
  bottom: 10%;
  right: 10%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.3;
  }
}

.not-found-content {
  text-align: center;
  z-index: 1;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-code {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.digit {
  font-size: 120px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

.digit.zero {
  animation-delay: 0.3s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 40px rgba(102, 126, 234, 0.8));
  }
}

.error-message {
  margin-bottom: 40px;
}

.error-message h1 {
  font-size: 36px;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 600;
}

.error-message p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
</style>
