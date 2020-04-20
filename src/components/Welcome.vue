<template>
  <div id="welcome">
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>用户信息</span>
              <el-button style="float: right;" size="mini" type="danger">用户中心</el-button>
            </div>
            <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
              <el-avatar
                shape="square"
                :size="60"
                :src="userInfo.avatar"
                style="float:left;"
                :key="1"
              ></el-avatar>
            </el-tooltip>
            <div class="right" style="float:right;width:520px;">
              <el-table :data="tableInfo" border height="120">
                <el-table-column prop="username" label="用户账号"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称"></el-table-column>
                <el-table-column prop="department" label="所属部门"></el-table-column>
                <el-table-column fixed="right" prop="roles" label="用户角色" width="150"></el-table-column>
              </el-table>
            </div>
          </el-card>

          <el-row style="margin-top:10px;" :gutter="10">
            <el-card style="height:125px;">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <router-link to="/products">
                    <img
                      src="../assets/11.png"
                      alt
                      width="60.8px;"
                      style="margin:0px auto; cursor: pointer;margin-left:20px;"
                    />
                  </router-link>
                  <div style="font-size:12px;margin-top:5px;margin-left:25px;">物资资料</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple-light">
                  <router-link to="/stocks">
                    <img
                      src="../assets/22.png"
                      alt
                      width="60.8px;"
                      style="cursor: pointer;margin-left:20px;"
                    />
                  </router-link>
                  <div style="font-size:12px;margin-top:5px;margin-left:25px;">物资库存</div>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content bg-purple-light">
                  <router-link to="/inStocks">
                    <img
                      src="../assets/44.png"
                      alt
                      width="60.8px;"
                      style="cursor: pointer;margin-left:20px;"
                    />
                  </router-link>

                  <div style="font-size:12px;margin-top:5px;margin-left:25px;">物资入库</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple"></div>

                <img
                  src="../assets/33.png"
                  alt
                  width="60.8px;"
                  style="cursor: pointer;margin-left:20px;"
                />
                <div style="font-size:12px;margin-top:5px;margin-left:25px;">物资发放</div>
              </el-col>
            </el-card>
          </el-row>
          <el-card class="box-card" style="margin-top:20px;">
            <div slot="header" class="clearfix">
              <span>轮播图</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div class="text item">
              <div class="block">
                <el-carousel height="150px">
                  <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small"></h3>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="block"></div>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>日历</span>
              <el-button style="float: right; padding: 3px 0" type="text">添加日程</el-button>
            </div>
            <div class="text item">
              <el-calendar>
                <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                <template slot="dateCell" slot-scope="{date, data}">
                  <p
                    :class="data.isSelected ? 'is-selected' : ''"
                  >{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}</p>
                </template>
              </el-calendar>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- <el-card class="box-card">
           <el-calendar v-model="value"></el-calendar>
    </el-card>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: new Date(),
      userInfo: {},
      tableInfo: []
    };
  },
  created() {
    this.userInfo = this.$store.state.userInfo;
    var roles = "";
    if (this.userInfo.roles.length > 0) {
      this.userInfo.roles.forEach(item => {
        roles += item.roleName + ",";
      });
    }
    this.tableInfo.push({
      username: this.userInfo.username,
      nickname: this.userInfo.nickname,
      department: this.userInfo.department,
      roles: roles.substring(0, roles.length - 1)
    });
  }
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
