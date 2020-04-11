<template>
  <div id="inStocks">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      <el-breadcrumb-item>物资入库</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索部分 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select @change="search" clearable  @clear="search" v-model="queryMap.type" placeholder="请选择入库类型">
          <el-option label="捐赠" value="1"></el-option>
          <el-option label="下拨" value="2"></el-option>
          <el-option label="采购" value="3"></el-option>
          <el-option label="借用" value="4"></el-option>
        </el-select>
        </el-col>

        <el-col :span="5">
      
          <el-input
            clearable
            @clear="search"
            v-model="queryMap.inNum"
            placeholder="请输入入库单查询"
             @keyup.enter.native="search"
            class="input-with-select"
          >
          </el-input>
        </el-col>
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
 </el-col>
        <el-col :span="3">
          <router-link to="/inStocks/addStocks">
            <el-button type="success" plain icon="el-icon-circle-plus-outline">添加入库</el-button>
          </router-link>
        </el-col>
        <el-col :span="2">
         <el-button type="button">导出表格<i class="el-icon-download el-icon--right"></i></el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table v-loading="loading" :data="tableData" border style="width: 100%;margin-top:20px;height:460px;">
        <el-table-column label="#" prop="id" width="50"></el-table-column>
        <el-table-column prop="inNum" label="入库单号" width="180"></el-table-column>
        <el-table-column prop="supplier" label="物资类型" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.type===1">捐赠</el-tag>
            <el-tag v-else-if="scope.row.type===2">下拨</el-tag>
            <el-tag type="danger" v-else-if="scope.row.type===3">采购</el-tag>
            <el-tag type="warning" v-else>借用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productNumber" label="物资数量"></el-table-column>
        <el-table-column prop="phone" label="联系方式" width="180"></el-table-column>
        <el-table-column prop="supplierName" label="物资提供方" width="180"></el-table-column>
        <el-table-column prop="createTime" label="入库时间" width="180"></el-table-column>
        <el-table-column prop="operator" label="操作员" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row.id)" type="text" size="small">明细</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryMap.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 入库明细 -->
      <el-dialog title="入库明细" :visible.sync="dialogVisible" width="50%">
        <span>
          <template>
            <el-table  max-height="350" border :data="detailTable" style="width: 100%">
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="pnum" label="商品编号"></el-table-column>
               <el-table-column prop="model" label="规格"></el-table-column>
              <el-table-column
                prop="imageUrl"
                label="图片"
                align="center"
                width="150px"
                padding="0px"
              >
                <template slot-scope="scope">
                  <img
                    :src="'http://www.zykhome.club/'+scope.row.imageUrl"
                    alt
                    style="width: 30px;height:30px"
                  />
                </template>
              </el-table-column>
               <el-table-column prop="count" label="数量"></el-table-column>
                <el-table-column prop="unit" label="单位"></el-table-column>
            </el-table>
          </template>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      detailTable:[],
      dialogVisible: false,
      total: 0,
      queryMap: { pageNum: 1, pageSize: 10 },
      tableData: []
    };
  },
  methods: {
    /**
     * 查看入库单明细
     */
    async detail(id) {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      const { data: res } = await this.$http.get("inStock/detail/" + id);
      if (res.code !== 200) {
        return this.$message.error("获取明细失败");
      } else {
        this.detailTable=res.data.itemVOS;
      }
       setTimeout(() => {
          loading.close();
        this.dialogVisible = true;
        }, 500);
    },
    /**
     * 加载表格数据
     */
    async loadTableData() {
      const { data: res } = await this.$http.get("inStock/findInStockList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取列表失败");
      } else {
        this.total = res.data.total;
        this.tableData = res.data.rows;
      }
    },
    /**
     * 改变页码
     */
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.loadTableData();
    },
    /**
     * 查询入库单
     */
    search(){
      this.queryMap.pageNum=1;
      this.loadTableData();
    },
    /**
     * 点击分页
     */
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.loadTableData();
    }
  },
  created() {
    this.loadTableData();
    setTimeout(() => {
       this.loading=false;
    }, 1000);
  }
};
</script>

<style>
</style>