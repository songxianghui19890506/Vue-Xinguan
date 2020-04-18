<template>
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div>
        <span style="margin-left:20px;">新冠-物资管理系统</span>
      </div>

      <el-dropdown>
        <div class="block">
          <el-avatar :size="50" :src="circleUrl" style="cursor: pointer;"></el-avatar>
        </div>

        <el-dropdown-menu slot="dropdown" trigger="click">
          <el-dropdown-item>
            <span type="danger" @click="logout">退出登入</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!--主体-->
    <el-container>
      <!--菜单-->
      <el-aside :width="isOpen==true?'64px':'200px'">
        <div class="toggle-btn" @click="toggleMenu">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isOpen"
          :router="true"
          :default-active="activePath"
          background-color="#303030"
          :collapse-transition="false"
          text-color="rgba(255,255,255,0.7)"
          unique-opened
        >
          <Menu :menuList="this.menuList"></Menu>
        </el-menu>
      </el-aside>
      <!--右边主体-->
        <el-main v-loading="loading">
          <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Menu from "./Menu.vue"; //引进菜单模板

export default {
  data() {
    return {
      loading: true,
      activePath: "", //激活的路径
      isOpen: false,
      circleUrl: "", //用户头像
      menuList: {}
    };
  },
  components: {
    Menu
  },
  methods: {
    /**
     * 
     * 退出登入
     */
    async logout() {
       var res = await this.$confirm(
        "此操作将退出系统, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消退出登入"
        });
      });
      if (res == "confirm") {
      window.localStorage.clear();
      this.$router.push("/login");
      }
    },
    /**
      加载菜单数据
     */
    async getMenuList() {
      const { data: res } = await this.$http.get("user/findMenu");
      if (res.code !== 200) return this.$message.error("获取菜单失败:"+res.msg);
      this.menuList = res.data;
    },
    /**
      获取用户信息
     */
    async getUserInfo() {
      const { data: res } = await this.$http.get("user/info");
      if (res.code !== 200) return this.$message.error("获取用户信息失败:"+res.msg);
      this.circleUrl = res.data.avatar;
      var urls = [];
      res.data.menus.forEach((item, index, array) => {
        //执行代码
        if (item != null && item != "") {
          urls.push(item.url);
        }
      });
      var m = urls.filter(s => {
        return s && s.trim();
      });
      sessionStorage.setItem("urls", m);
      sessionStorage.setItem("roles", res.data.roles);
    },
    /**
     * 菜单伸缩
     */
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }
  },
  created() {
    this.getMenuList();
    this.getUserInfo();
    this.activePath = window.sessionStorage.getItem("activePath");
    // if(window.sessionStorage.getItem("activePath")==null){
    //   this.activePath='/welcome';
    // }
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
};
</script>

<style>
/* 为对应的路由跳转时设置动画效果 */

.el-header {
  background-color: #2b2929;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 19px;

  padding-left: 0px;
}
.el-aside {
  background-color: #303030;
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  width: 100%;
  height: 100% !important;
}
.toggle-btn {
  background-color: #1890ff;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>