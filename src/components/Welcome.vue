<template>
  <div id="welcome">
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>

   <el-row>
        <el-card class="box-card">
        
           <el-calendar v-model="value"></el-calendar>
        </el-card>
      
    </el-row>
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
