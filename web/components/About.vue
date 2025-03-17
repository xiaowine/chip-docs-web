<!-- src/components/About.vue -->
<template>
  <div class="section about">
    <div class="avatar-container">
      <div class="avatar-image"></div>
    </div>
    <div class="social-links">
      <a
        href="https://github.com/xiaowine"
        target="_blank"
        class="social-icon github-icon"
      >
      </a>
      <a
        href="https://space.bilibili.com/393492876"
        target="_blank"
        class="social-icon bilibili-icon"
      >
      </a>
      <a
        href="https://oshwhub.com/xiao_wine"
        target="_blank"
        class="social-icon jlc-icon"
      >
      </a>
    </div>
    <div class="author-name">xiao_wine</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

/* 头像相关样式 */
.avatar-container {
  z-index: 3;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}
.avatar-container:hover {
  width: 140px;
  height: 140px;
}

.avatar-container:hover .avatar-image {
  transform: scale(1.1);
  width: 100%;
  height: 100%;
}

.avatar-image {
  width: 100%;
  height: 100%;
  background: url("../assets/avatar.png") center center no-repeat;
  background-size: cover;
  transition: all 0.3s ease;
}

/* 社交图标容器 */
.social-links {
  z-index: 2;
  display: flex;
  gap: 20px;
  margin: 20px auto;
}

/* 社交图标通用样式 */
.social-icon {
  width: 32px;
  height: 32px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.2);
}

/* GitHub图标 */
.github-icon {
  background-image: url("../assets/github.svg");
}

/* Bilibili图标 */
.bilibili-icon {
  background-image: url("../assets/bilibili.svg");
}

/* Email图标 */
.jlc-icon {
  background-image: url("../assets/jlc.svg");
}

/* 作者名称样式 */
.author-name {
  margin-top: 15px;
  font-size: 1.5em;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(
    90deg,
    #ff6b6b,
    #4ecdc4,
    #45b7d1,
    #96ceb4,
    #ffeead,
    #d4a5a5,
    #ff6b6b
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: rgb-text 8s linear infinite;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  position: relative;
  z-index: 1;
}

.author-name:hover {
  text-shadow: 0 0 15px rgba(255, 255, 255, 1);
}
/* 动画定义 */
@keyframes rgb-text {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
