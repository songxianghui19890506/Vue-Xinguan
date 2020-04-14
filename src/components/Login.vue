<template>
  <div id="login">
    <el-form
      :model="userLoginForm"
      :rules="loginRules"
      status-icon
      ref="userLoginFormRef"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text"
          @keyup.enter.native="handleSubmit"
          v-model="userLoginForm.username"
          auto-complete="off"
          placeholder="用户名"
          prefix-icon="iconfont el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          @keyup.enter.native="handleSubmit"
          type="password"
          v-model="userLoginForm.password"
          auto-complete="off"
          placeholder="密码"
          prefix-icon="el-icon-suitcase-1"
        ></el-input>
      </el-form-item>
    <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <div style="float:right;">
          <el-button
            type="primary"
            class="el-icon-thumb"
            @click="handleSubmit"
            :loading="loading"
          >登录</el-button>
          <el-button
            type="primary"
            class="el-icon-refresh"
            style="background-color:#909399"
            @click="resetForm"
          >重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgCode:undefined,
      //表单用户登入数据
      loading: false,
      userLoginForm: { username: "系统测试人员", password: "123456" ,imgCode:'',},
      checked: false,

      //验证规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {

    //登入提交
    handleSubmit: function() {
      this.$refs.userLoginFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          this.loading = true;
          //发起登入请求
          const { data: res } = await this.$http.post(
            "user/login?username=" +
              this.userLoginForm.username +
              "&password=" +
              this.userLoginForm.password
          );
          console.log(res);
          if (res.code == 200) {
            this.$message({
              title: "登入成功",
              message: "欢迎你进入系统",
              type: "success"
            });
            //保存token
            localStorage.setItem("JWT_TOKEN", res.data);
            //跳转到home
            this.$router.push("/home");
          } else {
            this.$message.error({
              title: "登入失败",
              message: res.msg,
              type: "error"
            });
          }
          this.loading = false;
        }
      });
    },
    //重置表单
    resetForm: function() {
      this.$refs.userLoginFormRef.resetFields();
    }
  },
  created() {
    const h = this.$createElement;
    this.$notify({
      title: "众志成城抗击疫情",
      message: h(
        "i",
        { style: "color: #303030" },
        "欢迎您访问基于SpringBoot+Vue开发的前后端分离系统，新冠-物资管理系统,Vue,SpringBoot,JWT,Shiro,通用Mapper"
      )
    });
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}

.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 40px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 5px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>


