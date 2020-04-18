<template>
  <div id="addStocks">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/inStocks' }">物资管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/inStocks' }">物资入库</el-breadcrumb-item>
      <el-breadcrumb-item >添加入库</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->

    <el-row :gutter="20">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card>
            <el-form
              ref="addRuleFormRef"
              :rules="addRules"
              style="height:460px;"
              :model="addRuleForm"
              label-width="80px"
            >
              <el-form-item label="商品来源" prop="supplierId">
                <el-select
                  style="width:100%;"
                  filterable
                  v-model="addRuleForm.supplierId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in suppliers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入库类型" prop="type">
                <el-radio-group v-model="addRuleForm.type">
                  <el-radio :label="1">捐赠</el-radio>
                  <el-radio :label="2">下拨</el-radio>
                  <el-radio :label="3">采购</el-radio>
                  <el-radio :label="4">借用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="物资总类">
                <el-input-number v-model="itemNum" :disabled="true"></el-input-number>
              </el-form-item>
              <el-form-item label="物资明细">
                <el-button size="mini" plain icon="el-icon-search" @click="drawer = true">查看明细</el-button>
              </el-form-item>
              <el-form-item label="描述信息" prop="remark">
                <el-input type="textarea" :rows="5" v-model="addRuleForm.remark"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="add">立即创建</el-button>

                <el-button @click="test">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-col>

      <el-col :span="14">
        <div class="grid-content bg-purple-light">
          <el-card>
            <!-- 查询搜索 -->
            <el-form :inline="true" :model="queryMap" class="demo-form-inline">
              <el-form-item label="分类">
                <el-cascader
                  :change-on-select="true"
                  @change="selectChange"
                  v-model="categorykeys"
                  :props="selectProps"
                  :options="catetorys"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item>
                <el-form-item label="名称">
                  <el-input clearable v-model="queryMap.name" placeholder="名称" @clear="search"></el-input>
                </el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
              </el-form-item>
            </el-form>
            <!-- 入库预选表格 -->
            <el-table
              style="height:460px;"
              :data="tableData"
              :row-key="getRowKey"
              ref="dataTable"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column type="selection" :reserve-selection="true"></el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="pnum" label="商品编号"></el-table-column>
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
                    style="width: 50px;height:50px"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="model" label="型号"></el-table-column>
              <el-table-column prop="unit" label="单位"></el-table-column>
            </el-table>
            <!-- 表格分页 -->
            <el-pagination
              background
              style="margin-top:10px;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryMap.pageNum"
              :page-sizes="[5, 8, 16, 20]"
              :page-size="queryMap.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="total"
            ></el-pagination>
            <!-- 抽屉 -->
            <el-drawer size="50%" title="入库明细" :visible.sync="drawer" :with-header="false">
              <span>
                <el-table :data="products" border>
                  <el-table-column prop="name" label="名称" width="120px;"></el-table-column>
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
                        style="width: 50px;height:50px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="model" label="型号" width="100px;"></el-table-column>

                  <el-table-column label="数量">
                    <template slot-scope="scope">
                      <el-input-number
                        size="mini"
                        v-model="scope.row.number"
                        :min="1"
                        :max="10"
                        label="描述文字"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位" width="80px;"></el-table-column>
                  <el-table-column label="操作" width="150px;">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        size="small"
                        icon="el-icon-close"
                        @click="removeItem(scope.row.id)"
                      >移除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </span>
            </el-drawer>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addRules: {
        supplierId: [
          { required: true, message: "请选中物资来源", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选中入库类型", trigger: "blur" }],
        remark: [
          { required: true, message: "请输入商品说明备注", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
        ]
      }, //添加验证
      itemNum: 0,
      addRuleForm: {type:1},
      suppliers: [],
      categorykeys: [],
      selectProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "children"
      }, //级联选择器配置项
      catetorys: [],
      drawer: false,
      total: 0,
      queryMap: {
        pageNum: 1,
        pageSize: 5
      },
      form: {},
      tableData: [],
      products: []
    };
  },
  methods: {
    /**
     * 创建入库单
     */
    //添加
    add() {
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          var car = [];
          this.products.forEach(row => {
            if (row.number != undefined) {
              var item = { productId: row.id, productNumber: row.number };
              car.push(item);
            }
          });
          if (car.length > 0) {
            this.addRuleForm.products = car;
          } else {
            return this.$message.warning(
              "入库商品的数量不能为空，请勾选物资后在明细中添加数量"
            );
          }
          var res = await this.$confirm("此操作将商品入库, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
          if (res == "confirm") {
            const { data: res } = await this.$http.post(
              "inStock/addIntoStock",
              this.addRuleForm
            );
            if (res.code == 200) {
              this.$message.success("商品入库成功");
              this.$router.push("/inStocks");
            } else {
              return this.$message.error("商品入库失败:" + res.msg);
            }
          }

          this.addDialogVisible = false;
        }
      });
    },
    /**
     * 加载商品列表
     */
    async loadTableData() {
      const { data: res } = await this.$http.get("product/findProductList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取商品列表失败");
      } else {
        this.total = res.data.total;
        this.tableData = res.data.rows;
      }
    },
    /**
     * 分类搜索改变时
     */
    selectChange() {
      var str = "";
      for (var i = 0; i < this.categorykeys.length; i++) {
        str += this.categorykeys[i] + ",";
      }
      str = str.substring(0, str.length - 1);
      this.queryMap.categorys = str;
    },
    /**
     * 加载商品类别
     */
    async getCatetorys() {
      const { data: res } = await this.$http.get(
        "productCategory/categoryTree"
      );
      if (res.code !== 200) {
        return this.$message.error("获取商品类别失败");
      } else {
        this.catetorys = res.data.rows;
      }
    },
    /**加载来源数据
     */
    async getSuppliers() {
      const { data: res } = await this.$http.get("supplier/findAll");
      if (res.code !== 200) {
        return this.$message.error("获取来源数据失败");
      } else {
        this.suppliers = res.data;
      }
    },

    /**
     * 搜索
     */
    search() {
      this.queryMap.pageNum = 1;
      this.loadTableData();
    },
    /**
     *  指定一个key标识这一行的数据
     */
    getRowKey(row) {
      return row.id;
    },
    /**
     * val表示选中的表格行数据
     */
    handleSelectionChange(val) {
      this.products = val;
      this.itemNum = val.length;
    },
    /**
     * 改变页码
     */
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.loadTableData();
    },
    /**
     * 点击分页
     */
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.loadTableData();
    },
    /**
     * 测试
     */
    test() {
      console.log(this.products);
    },
    /**
     * 移除item从抽屉中
     */
    removeItem(val) {
      this.products.forEach(row => {
        if (row.id == val) {
          this.$refs.dataTable.toggleRowSelection(row, false);
        }
      });
      this.products = this.products.filter(item => item.id !== val);
    }
  },
  created() {
    this.loadTableData();
    this.getCatetorys();
    this.getSuppliers();
  }
};
</script>