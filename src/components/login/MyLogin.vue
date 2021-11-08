<template>
  <div class="wrapper">
    <div class="container">
      <div class="wrapper">
        <div class="left-top-sign">LOGIN</div>
        <div class="welcome" @click="backToHome">
          <i class="icon-back"></i>
        </div>
        <div class="input-content">
          <div class="input-item">
            <text class="tit">手机号码</text>
            <input
              type="text"
              placeholder="请输入手机号码"
              id="phone"
              @input="handleInput"
            />
          </div>
          <div class="input-item">
            <text class="tit">密码</text>
            <input
              type="password"
              placeholder="请输入密码"
              id="password"
              @input="handleInput"
            />
          </div>
        </div>
        <button class="confirm-btn" @click="handleLogin">
          使用真实网易云账号登录
        </button>
        <div class="forget-section" @click="handleLoginFake">一键模拟登录</div>
        <div
          class="forget-section"
          style="color: rgba(0, 0, 0, 0.5); font-size: 20rem"
          @click="backToHome"
        >
          无法登录,返回首页
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import request from "@/utils/request";
import { USER_INFO_KEY } from "@/assets/js/constant";

export default {
  name: "MyLogin",
  data() {
    return {
      phone: "",
      password: "",
    };
  },
  methods: {
    backToHome() {
      this.$router.push("/");
    },
    handleLoginFake() {
      console.log("handleLoginFake");
      this.phone = "18819258483";
      this.password = "0506CHEN1996";
      this.handleLogin();
    },

    handleInput(event) {
      this[event.target.id] = event.target.value;
    },
    async handleLogin() {
      // 2.前端验证
      const { phone, password } = this;
      if (!phone) {
        Toast({
          message: "手机号不能为空",
        });
        return;
      }
      const phoneReg = /^1\d{10}$/;
      if (!phoneReg.test(phone)) {
        Toast({
          message: "手机号格式错误",
        });
        return;
      }
      if (!password) {
        Toast({
          message: "密码不能为空",
        });
        return;
      }
      // 3.后端验证
      const res = await request("/login/cellphone", { phone, password });
      if (res.code === 200) {
        Toast({
          message: "登录成功",
        });
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(res.profile));
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      } else if (res.code === 400) {
        Toast({
          message: "手机号不正确",
        });
      } else if (res.code === 502) {
        Toast({
          message: "密码不正确",
        });
      } else {
        Toast({
          message: "登录失败,请重新登录",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: $color-background;

  //display: flex;
  //align-items: center;
  .icon-back {
    position: absolute;
    top: 20rem;
    left: -27rem;
    font-size: $font-size-large-x;
    color: #000;
  }
}

//.wrapper {
//  position: relative;
//  z-index: 90;
//  padding-bottom: 40rem;
//}

.left-top-sign {
  font-size: 120rem;
  color: #f8f8f8;
  position: relative;
  left: -16rem;
}

.welcome {
  position: relative;
  left: 50rem;
  top: -90rem;
  font-size: 46rem;
  color: #555;
}

.input-content {
  padding: 0 20rem;
}
.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rem;
  background: #f8f6fc;
  height: 180rem;
  border-radius: 4px;
  margin-bottom: 30rem;
}

.input-item:last-child {
  margin-bottom: 0;
}
.input-item .tit {
  height: 50rem;
  line-height: 56rem;
  font-size: 30rem;
  color: #606266;
}
.input-item input {
  height: 60rem;
  font-size: 26rem;
  color: #303133;
  width: 90%;

  padding-left: 20rem;
}

.confirm-btn {
  width: 400rem !important;
  height: 76rem;
  line-height: 76rem;
  border-radius: 50rem;
  margin: 70rem;
  background: #d43c33;
  color: #fff;
  font-size: 32rem;
  padding: 0;
}
.confirm-btn2:after {
  border-radius: 100px;
}

.forget-section {
  font-size: 28rem;
  color: #4399fc;
  text-align: center;
  margin-bottom: 70rem;
}

.register-section {
  position: absolute;
  left: 0;
  bottom: 50rem;
  width: 100%;
  font-size: 28rem;
  color: #606266;
  text-align: center;
}
.register-section text {
  color: #4399fc;
  margin-left: 10rem;
}
</style>
