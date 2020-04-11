<template>
  <div id="productCategroys">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      <el-breadcrumb-item>物资资料</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧卡片区域 -->
    <!-- 物资列表卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="6">
         <el-col :span="5">
          <el-cascader
            :change-on-select="true"
            @change="selectChange"
            v-model="categorykeys"
            :props="selectProps"
            :options="catetorys"
            @clear="search"
            clearable
          ></el-cascader>
        </el-col>
        <el-col :span="6">
          <el-input
            clearable
            v-model="queryMap.name"
            placeholder="请输入物资名称查询"
            @clear="search"
            class="input-with-select"
          ></el-input>
        </el-col>
       
        <el-col :span="6">
           <el-button type="primary" icon="el-icon-search" @click="search">查找</el-button>
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="openAdd">添加</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <template>
        <el-table
          v-loading="loading"
          border
          stripe
          :data="productData"
          style="width: 100%;margin-top:20px;"
          height="460"
        >
          <el-table-column prop="id" type="index" label="ID"></el-table-column>

          <el-table-column prop="name" label="物资名称"></el-table-column>
          <el-table-column prop="imageUrl" label="图片" align="center" width="150px" padding="0px">
            <template slot-scope="scope">
              <img
                :src="'http://www.zykhome.club/'+scope.row.imageUrl"
                alt
                style="width: 50px;height:50px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="pnum" label="物资编号"></el-table-column>
          <el-table-column label="物资规格">
            <template slot-scope="scope">
              <el-tag type="success" size="mini" closable v-text="scope.row.model"></el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="物资单位"></el-table-column>
          <el-table-column prop="stock" label="物资库存">
            <template slot-scope="scope">
              <el-tag
                type="success"
                v-if="scope.row.stock>500"
                size="mini"
                closable
                v-text="scope.row.stock+' '+scope.row.unit"
              ></el-tag>
              <el-tag
                type="info"
                v-else-if="scope.row.stock>250"
                size="mini"
                closable
                v-text="scope.row.stock+' '+scope.row.unit"
              ></el-tag>
              <el-tag
                type="warning"
                v-else-if="scope.row.stock>100"
                size="mini"
                closable
                v-text="scope.row.stock+' '+scope.row.unit"
              ></el-tag>
              <el-tag
                type="warning"
                v-else-if="scope.row.stock==0"
                size="mini"
                closable
                v-text="'暂无库存'"
              ></el-tag>
              <el-tag
                type="danger"
                v-else
                size="mini"
                closable
                v-text="scope.row.stock+' '+scope.row.unit"
              ></el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>

              <el-button type="text" size="mini" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
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
        :page-sizes="[4,6, 10, 15, 20]"
        :page-size="this.queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 物资添加弹出框 -->
      <el-dialog title="添加物资" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">
        <span>
          <el-form
            :model="addRuleForm"
            :rules="addRules"
            ref="addRuleFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="物资名称" prop="name">
              <el-input v-model="addRuleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="物资图片" prop="name">
              <!-- 图片上传部分 -->
              <el-upload
                action="http://www.zykhome.club:8081/upload/image"
                :class="{ disabled: uploadDisabled }"
                list-type="picture-card"
                :limit="limitcount"
                :on-change="handleChange"
                :on-remove="handleRemove"
                accept="image/*"
                :on-success="handleSuccess"
                :headers="headerObject"
                ref="upload"
                :on-preview="handlePictureCardPreview"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="物资规格" prop="model">
                    <el-input v-model="addRuleForm.model"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="分类" prop="categoryKeys">
                    <el-cascader
                      :options="catetorys"
                      clearable
                      filterable
                      :props="selectProps"
                      v-model="addRuleForm.categoryKeys"
                    ></el-cascader>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="单位" prop="unit">
                    <el-input v-model="addRuleForm.unit"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="addRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-form-item label="备注信息" prop="remark">
              <el-input type="textarea" v-model="addRuleForm.remark"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物资编辑弹出框 -->
      <el-dialog
        title="更新物资"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="closeEditDialog"
      >
        <span>
          <el-form
            :model="editRuleForm"
            :rules="addRules"
            ref="editRuleFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="物资名称" prop="name">
              <el-input v-model="editRuleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="物资图片" prop="name">
              <!-- 图片上传部分 -->
              <el-upload
                action="http://www.zykhome.club:8081/upload/image"
                :class="{ disabled: uploadDisabled }"
                list-type="picture-card"
                :limit="limitcount"
                accept="image/*"
                :on-success="editHandleSuccess"
                :headers="headerObject"
                ref="upload2"
                :on-preview="handlePictureCardPreview"
                :file-list="imgFilesList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="物资规格" prop="model">
              <el-input v-model="editRuleForm.model"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="单位" prop="unit">
                    <el-input v-model="editRuleForm.unit"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="editRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      headerObject: {
        Authorization: window.sessionStorage.getItem("JWT_TOKEN")
      }, //图片上传请求头
      catetorys: [], //类别选择
      selectProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "children"
      }, //级联选择器配置项
      editDialogVisible: false,
      addDialogVisible: false, //添加弹框是否显示
      total: 0, //总共多少条数据
      productData: [], //表格数据
      queryMap: {
        pageNum: 1,
        pageSize: 4,
        name: "",
        categoryId: "",
        supplier: ""
      }, //查询对象
      addRuleForm: {}, //添加表单数据
      editRuleForm: {}, //修改表单数据
      uploadDisabled: false,
      limitcount: 1,
      dialogImageUrl: "",
      dialogVisible: false,
      addRules: {
        name: [
          { required: true, message: "请输入物资名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "请输入物资单位", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        model: [
          { required: true, message: "请输入物资规格", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入物资说明备注", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        categorys: [
          { required: true, message: "请输入物资分类", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入地址信息", trigger: "blur" }],
        categoryKeys: [
          { required: true, message: "请选择物资分类", trigger: "blur" }
        ]
      }, //添加验证
      imgFilesList: [],
         categorykeys: [],
      selectProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "children"
      }, //级联选择器配置项
    };
  },
  methods: {
    //打开添加
    openAdd() {
      this.getCatetorys();
      this.addDialogVisible = true;
    },
    //搜索
    search() {
      this.queryMap.pageNum = 1;
      this.getproductList();
    },
    //删除物资
    async del(id) {
      var res = await this.$confirm(
        "此操作将永久删除该物资, 是否继续?",
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
        const { data: res } = await this.$http.delete("product/delete/" + id);
        if (res.code == 200) {
          this.$message.success("物资删除成功");
          this.getproductList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    //更新物资
    async update() {
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            "product/update/" + this.editRuleForm.id,
            this.editRuleForm
          );
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: "物资信息更新",
              type: "success"
            });
            this.editRuleForm = {};
            this.getproductList();
          } else {
            this.$message.error("物资信息更新失败:" + res.msg);
          }

          this.editDialogVisible = false;
        }
      });
    },
    //编辑
    async edit(id) {
      const { data: res } = await this.$http.get("product/edit/" + id);
      if (res.code == 200) {
        this.editRuleForm = res.data;
        var item = res.data;
        this.imgFilesList.push({
          url: "http://www.zykhome.club/" + item.imageUrl,
          name: item.name,
          id: item.id
        });
      } else {
        return this.$message.error("物资信息编辑失败" + res.msg);
      }
      this.editDialogVisible = true;
    },
    //添加
    add() {
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          console.log(this.addRuleForm);
          const { data: res } = await this.$http.post(
            "product/add",
            this.addRuleForm
          );
          if (res.code == 200) {
            this.$message.success("物资添加成功");
            this.addRuleForm = {};
            this.getproductList();
          } else {
            return this.$message.error("物资添加失败:" + res.msg);
          }
          this.addDialogVisible = false;
        }
      });
    },
    //加载物资列表
    async getproductList() {
      const { data: res } = await this.$http.get("product/findProductList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取物资列表失败");
      } else {
        this.total = res.data.total;
        this.productData = res.data.rows;
      }
    },
    //加载物资类别
    async getCatetorys() {
      const { data: res } = await this.$http.get(
        "productCategory/categoryTree"
      );
      if (res.code !== 200) {
        return this.$message.error("获取物资类别失败");
      } else {
        this.catetorys = res.data.rows;
      }
    },
    handleChange(file, fileList) {
      this.uploadDisabled = fileList.length >= this.limitcount;
    },
    handleRemove(file, fileList) {
      this.uploadDisabled = fileList.length >= this.limitcount;
      this.addRuleForm.imageUrl = "";
    },
    //改变页码
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getproductList();
    },
    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getproductList();
    },
    //关闭弹出框
    closeAddDialog() {
      this.$refs.addRuleFormRef.clearValidate();
      this.addRuleForm = {};
      this.$refs.upload.clearFiles();
    },
    //关闭弹出框
    closeEditDialog() {
      this.$refs.editRuleFormRef.clearValidate();
      this.editRuleForm = {};
      this.$refs.upload2.clearFiles();
      this.imgFilesList = [];
    },
    handleSuccess(response, file, fileList) {
      this.addRuleForm.imageUrl = response.msg;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //编辑
    editHandleSuccess(response, file, fileList) {
      this.editRuleForm.imageUrl = response.msg;
    },
     /**
     * 加载物资类别
     */
    async getCatetorys() {
      const { data: res } = await this.$http.get(
        "productCategory/categoryTree"
      );
      if (res.code !== 200) {
        return this.$message.error("获取物资类别失败");
      } else {
        this.catetorys = res.data.rows;
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
      this.getproductList();
    },
  },
  created() {
    this.getproductList();
    this.getCatetorys();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>

