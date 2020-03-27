<template>
  <div id="productCategroys">
    <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧卡片区域 -->
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            clearable
            v-model="queryMap.name"
            placeholder="请输入供应商查询"
            @clear="search"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            type="warning"
            plain
            icon="el-icon-circle-plus-outline"
            @click="addDialogVisible=true"
          >添加</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <template>
        <el-table
          border
          v-loading="loading"
          stripe
          :data="supplierData"
          style="width: 100%;margin-top:20px;"
          height="460"
        >
          <el-table-column prop="id" type="index" label="ID" width="50"></el-table-column>
          <el-table-column prop="name" label="物资提供方" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="phone" label="电话"></el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
               
                icon="el-icon-edit"
                @click="edit(scope.row.id)"
              >编辑</el-button>

              <el-button
                type="text"
               
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
      <!-- 系别添加弹出框 -->
      <el-dialog title="添加类别" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">
        <span>
          <el-form
            :model="addRuleForm"
            :rules="addRules"
            ref="addRuleFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="addRuleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="地址" prop="address">
              <el-input v-model="addRuleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addRuleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="addRuleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="addRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 系别编辑弹出框 -->
      <el-dialog
        title="更新类别"
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
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="editRuleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="地址" prop="address">
              <el-input v-model="editRuleForm.address"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editRuleForm.email"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="phone">
              <el-input v-model="editRuleForm.phone"></el-input>
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="editRuleForm.sort" :min="1" :max="10" label="排序"></el-input-number>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    return {
      loading:true,
      editDialogVisible: false,
      addDialogVisible: false, //添加弹框是否显示
      total: 0, //总共多少条数据
      supplierData: [], //表格数据
      queryMap: { pageNum: 1, pageSize: 7, name: "" }, //查询对象
      addRuleForm: {}, //添加表单数据
      editRuleForm: {}, //修改表单数据
      deans: [], //所有系主任
      addRules: {
        name: [
          { required: true, message: "请输入类别名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入地址信息", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
        ],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],

        phone: [
          {
            required: true,
            message: "请输入联系方式",
            validator: checkPhone,
            trigger: "blur"
          }
        ]
      } //添加验证
    };
  },
  methods: {
    //搜索
    search() {
      this.queryMap.pageNum = 1;
      this.getSupplierList();
    },
    //删除类别
    async del(id) {
      var res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
        const { data: res } = await this.$http.delete("supplier/delete/" + id);
        if (res.code == 200) {
          this.$message.success("类别删除成功");
          this.getSupplierList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    //更新用户
    async update() {
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post(
            "supplier/update/" + this.editRuleForm.id,
            this.editRuleForm
          );
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: "类别信息更新",
              type: "success"
            });
            this.editRuleForm = {};
            this.getSupplierList();
          } else {
            this.$message.error("类别信息更新失败:" + res.msg);
          }

          this.editDialogVisible = false;
        }
      });
    },
    //编辑
    async edit(id) {
      const { data: res } = await this.$http.get("supplier/edit/" + id);
      if (res.code == 200) {
        this.editRuleForm = res.data;
      } else {
        return this.$message.error("类别信息编辑失败" + res.msg);
      }
      this.editDialogVisible = true;
    },
    //添加
    add() {
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post(
            "supplier/add",
            this.addRuleForm
          );
          if (res.code == 200) {
            this.$message.success("类别添加成功");
            this.addRuleForm = {};
            this.getSupplierList();
          } else {
            return this.$message.error("类别添加失败:" + res.msg);
          }
          this.addDialogVisible = false;
        }
      });
    },
    //加载系别列表
    async getSupplierList() {
      const { data: res } = await this.$http.get("supplier/findSupplierList", {
        params: this.queryMap
      });
      if (res.code !== 200) {
        return this.$message.error("获取用户列表失败");
      } else {
        this.total = res.data.total;
        this.supplierData = res.data.rows;
      }
    },

    //改变页码
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getSupplierList();
    },
    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getSupplierList();
    },
    //关闭弹出框
    closeAddDialog() {
      this.$refs.addRuleFormRef.clearValidate();
      this.addRuleForm = {};
    },
    //关闭弹出框
    closeEditDialog() {
      this.$refs.editRuleFormRef.clearValidate();
      this.editRuleForm = {};
    }
  },
  created() {
    this.getSupplierList();
       setTimeout(() => {
          this.loading = false;
    }, 500);
  }
};
</script>
