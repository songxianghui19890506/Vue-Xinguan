<template>
  <div id="LoginLogs">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>登入日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧卡片区域 -->
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input
            clearable
            v-model="queryMap.userName"
            placeholder="请输入用户名查询"
            @clear="search"
            class="input-with-select"
          ></el-input>
        </el-col>
        <el-col :span="5">
          <el-input
            clearable
            v-model="queryMap.ip"
            placeholder="请输入IP查询"
            @clear="search"
            class="input-with-select"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-input
            clearable
            v-model="queryMap.location"
            placeholder="请输入登入地点查询"
            @clear="search"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-button @click="deleteFileOrDirectory(sels)" :disabled="this.sels.length === 0">批量删除</el-button>
      </el-row>

      <!-- 表格区域 -->
      <template>
        <el-table
          border
          stripe
          :data="LoginLogData"
          style="width: 100%;margin-top:20px;"
          height="460"
          @selection-change="selsChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="id" type="index" label="ID" width="50"></el-table-column>
          <el-table-column prop="userName" label="登入用户" width="150"></el-table-column>
          <el-table-column prop="loginTime" label="登入时间" width="190"></el-table-column>
          <el-table-column prop="location" label="登入地点" width="250"></el-table-column>
          <el-table-column prop="ip" label="IP地址"></el-table-column>
          <el-table-column prop="userSystem" label="操作系统" width="150"></el-table-column>
          <el-table-column prop="userBrowser" label="浏览器"></el-table-column>
          <el-table-column label="操作" width="100px;">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="del(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryMap.pageNum"
        :page-sizes="[7, 10, 15, 20]"
        :page-size="this.queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sels: [], //选中的值显示
      LoginLogData: [],
      total: 0, //总共多少条数据
      queryMap: { pageNum: 1, pageSize: 7, location: "" } //查询对象
    };
  },
  methods: {
    async deleteFileOrDirectory() {
      var ids = this.sels.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
       var res = await this.$confirm(
        "此操作将永久批量删除登入日志, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      if (res == "confirm") {
        const { data: res } = await this.$http.delete("loginLog/batchDelete/" + ids);
        if (res.code == 200) {
          this.$message.success("登入日志删除成功");
          this.getLoginLogList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    selsChange(sels) {
      this.sels = sels;
    },
    //搜索
    search() {
      this.queryMap.pageNum = 1;
      this.getLoginLogList();
    },

    //加载登入日志列表
    async getLoginLogList() {
      const { data: res } = await this.$http.get("loginLog/findLoginLogList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取列表失败");
      } else {
        this.total = res.data.total;
        this.LoginLogData = res.data.rows;
      }
    },
    //删除登入日志
    async del(id) {
      var res = await this.$confirm(
        "此操作将永久删除该登入日志, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      if (res == "confirm") {
        const { data: res } = await this.$http.delete("loginLog/delete/" + id);
        if (res.code == 200) {
          this.$message.success("登入日志删除成功");
          this.getLoginLogList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },

    //改变页码
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getLoginLogList();
    },
    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getLoginLogList();
    }
  },
  created() {
    this.getLoginLogList();
  }
};
</script>
