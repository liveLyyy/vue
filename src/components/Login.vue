<template>
  <div class="login_contana">
    <div class="login_box">
      <div class="ava_box">
        <!--头像区域-->
        <img src="../assets/logo.png">
        <!--登录表单区域-->
      </div>
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFromRef">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click=restLoginFrom>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        //表单验证规则对象
        loginFormRules: {
          //验证用户名是否合法
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 15个字符', trigger: 'blur'}
          ],
          //验证密码是否合法
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //点击重置按钮重置表单
      restLoginFrom() {
        this.$refs.loginFromRef.resetFields();
      },
      login() {
        this.$refs.loginFromRef.validate((async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post("user/login", this.loginForm);
          if (res.code !==200)return this.$message.error("登录失败！！！");
          this.$message.success("登录成功");
          window.sessionStorage.setItem('token',res.data.token);
          this.$router.push("/home");
        }));
      }
    }
  }
</script>

<style scoped>

  .login_contana {
    background-color: #2b4b6b;
    height: 100%;

  }

  .login_box {
    height: 300px;
    width: 450px;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    background-color: #fff;
    position: absolute;
    transform: translate(-50%, -50%);

  }

  .ava_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

</style>
