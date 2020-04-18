<template>
  <div id="welcome">
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
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
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>轮播图</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div class="text item">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="item in 6" :key="item">
                  <h3 class="medium"></h3>
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-card>

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
              <div class="block">
              </div>
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
      value: new Date()
    };
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
