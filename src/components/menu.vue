<template>
  <div>
    <template v-for="item in this.menuList">
      <el-submenu :index="item.id+''" v-if="item.children.length>0" :key="item.id+''">
        <template slot="title" style="padding-left:10px">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.menuName}}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-submenu>
      <el-menu-item
        v-else
        :index="item.url+''"
        :route="item.url"
        @click="savePath(item.url)"
        :key="item.id+''"
        style="padding-left: 50px;"
      >
        <i :class="item.icon"></i>
        <span>{{item.menuName}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<style>
.el-menu--collapse span,
.el-menu--collapse i.el-submenu__icon-arrow {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>
<script>
export default {
  name: "Menu", //模板名称
  data() {
    return {
    };
  },
  beforeMount() {},
  props: ["menuList"],
  methods:{
     //保存激活路径
    savePath(path) {
      window.sessionStorage.setItem("activePath", path);
      this.activePath = path;
    }
  }
};
</script>