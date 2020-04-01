<template>
  <div id="users">
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表卡片区 -->
    <el-card class="box-card">
      <el-form :inline="true" ref="form" :model="queryMap" label-width="70px">
        <el-form-item label="用户名">
          <el-input
            style="width:180px;"
            @clear="searchUser"
            clearable
            v-model="queryMap.username"
            placeholder="请输入用户名查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            style="width:150px;"
            clearable
            v-model="queryMap.sex"
            @clear="searchUser"
            placeholder="请选择性别查询"
          >
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            style="width:150px;"
            clearable
            @clear="searchUser"
            v-model="queryMap.email"
            placeholder="请输入邮箱查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select  clearable
            @clear="searchUser" v-model="queryMap.departmentId" placeholder="请选择所属部门">
            <el-option
              v-for="department in departments"
              :key="department.id"
              :label="department.name"
              :value="department.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="昵称">
          <el-input
            style="width:150px;"
            clearable
            @clear="searchUser"
            v-model="queryMap.nickname"
            placeholder="请输入昵称查询"
          ></el-input>
        </el-form-item>-->
        

        <el-form-item>
          <el-button plain type="primary" @click="searchUser" icon="el-icon-search">查询</el-button>
          <el-button
            plain
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="addDialogVisible=true"
          >添加</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table v-loading="loading" :data="userList" border style="width: 100%;" height="457">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column label="#" prop="id" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="110"></el-table-column>
        <el-table-column prop="sex" :formatter="showSex" label="性别" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex==1">帅哥</el-tag>
            <el-tag type="danger" v-else>美女</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="所属部门" width="180" sortable></el-table-column>
        <el-table-column prop="birth" label="生日" width="180" sortable></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话" width="150"></el-table-column>
        <el-table-column prop="isban" label="是否禁用" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changUserStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>

            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-s-tools"
                @click="assignRoles(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryMap.pageNo"
        :page-sizes="[6, 20, 30, 40]"
        :page-size="queryMap.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加对话框 -->
      <el-dialog title="添加用户" @close="closeDialog" :visible.sync="addDialogVisible" width="50%;">
        <!-- 表单 -->
        <span>
          <el-form
            :model="addForm"
            :label-position="labelPosition"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="80px"
          >
            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="部门" prop="departmentId">
                    <el-select v-model="addForm.departmentId" placeholder="请选择所属部门">
                      <el-option
                        v-for="department in departments"
                        :key="department.id"
                        :label="department.name"
                        :value="department.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="addForm.nickname"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addForm.sex">
                      <el-radio :label="1">帅哥</el-radio>
                      <el-radio :label="0">美女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phoneNumber">
              <el-input v-model="addForm.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item prop="birth"  label="生日">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  value-format="yyyy年MM月dd日"
                  placeholder="选择出生日期"
                  v-model="addForm.birth"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editClose">
        <span>
          <el-form
            :model="editForm"
            :label-position="labelPosition"
            :rules="addFormRules"
            ref="editFormRef"
            label-width="80px"
          >
            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" :disabled="true"></el-input>
                    <el-input
                      type="hidden"
                      v-model="editForm.id"
                      :disabled="true"
                      style="display:none;"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="部门" prop="departmentId">
                    <el-select v-model="editForm.departmentId" placeholder="请选择所属部门">
                      <el-option
                        v-for="department in departments"
                        :key="department.id"
                        :label="department.name"
                        :value="department.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="editForm.nickname"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                      <el-radio :label="1">帅哥</el-radio>
                      <el-radio :label="0">美女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="editForm.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item prop="birth" label="生日">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  value-format="yyyy年MM月dd日"
                  placeholder="选择出生日期"
                  v-model="editForm.birth"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog center title="分配角色" :visible.sync="assignDialogVisible" width="49%">
        <span>
          <template>
            <el-transfer
              :titles="['未拥有','已拥有']"
              :button-texts="['到左边', '到右边']"
              v-model="value"
              :data="roles"
            ></el-transfer>
          </template>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignDialogVisible = false" class="el-icon-close">取消分配</el-button>
          <el-button type="primary" @click="doAssignRoles" class="el-icon-check">确定分配</el-button>
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
      departments: [],
      loading: true,
      total: 0,
      addDialogVisible: false, //添加对话框,
      editDialogVisible: false, //修改对话框
      assignDialogVisible: false, //分配角色对话框
      labelPosition: "right", //lable对齐方式
      //查询对象
      queryMap: {
        pageNum: 1,
        pageSize: 6,
        username: "",
        sex: "",
        nickname: ""
      },
      userList: [],

      addForm: {
        username: "",
        nickname: "",
        password: "",
        email: "",
        phoneNumber: "",
        sex: "",
        birth: ""
      }, //添加表单
      editForm: {}, //更新表单
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        departmentId: [
          { required: true, message: "请选择部门", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birth: [{ required: true, message: "请填写出生日期", trigger: "blur" }],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        sex: [{ required: true, message: "请填写用户性别", trigger: "blur" }],
        phoneNumber: [
          {
            required: true,
            message: "请输入联系方式",
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ]
      }, //添加表单验证规则
      roles: [], //角色
      value: [], //用户拥有的角色
      uid: ""
    };
  },
  methods: {
    //弹出用户分配角色
    async assignRoles(id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      const { data: res } = await this.$http.get("user/" + id + "/roles");
      if (res.code == 200) {
        this.roles = res.data.roles;
        this.value = res.data.values;
        this.uid = id;

        setTimeout(() => {
          loading.close();
          this.assignDialogVisible = true;
        }, 400);
      }
    },
    //确定分配角色
    async doAssignRoles() {
      this.assignDialogVisible = true;
      const { data: res } = await this.$http.post(
        "user/" + this.uid + "/assignRoles",
        this.value
      );
      if (res.code == 200) {
        this.$message.success("分配权限成功");
      } else {
        this.$message.error("分配权限失败:" + res.msg);
      }
      this.assignDialogVisible = false;
    },
    //加载用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("user/findUserList", {
        params: this.queryMap
      });
      if (res.code !== 200) return this.$message.error("获取用户列表失败");
      this.total = res.data.total;
      this.userList = res.data.rows;
    },
    showSex(row, column) {
      return row.sex == 1 ? "帅哥" : "美女";
    },
    //删除用户
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
        const { data: res } = await this.$http.delete("user/delete/" + id);
        console.log(res);
        if (res.code == 200) {
          this.$message.success("用户删除成功");
          this.getUserList();
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    //添加用户
    async addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post("user/add", this.addForm);
          if (res.code == 200) {
            this.$message.success("用户添加成功");
            this.addForm = {};
            this.getUserList();
          } else {
            return this.$message.error("用户添加失败:" + res.msg);
          }
          this.addDialogVisible = false;
        }
      });
    },
    //更新用户
    async updateUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post(
            "user/update/" + this.editForm.id,
            this.editForm
          );
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: "用户信息更新",
              type: "success"
            });
            this.editForm = {};
            this.getUserList();
          } else {
            this.$message.error("用户信息更新失败:" + res.msg);
          }

          this.editDialogVisible = false;
        }
      });
    },
    //搜索
    searchUser() {
      this.queryMap.pageNum = 1;
      this.getUserList();
    },
    //修改
    async edit(id) {
      const { data: res } = await this.$http.get("user/edit/" + id);
      if (res.code == 200) {
        this.editForm = res.data;
      } else {
        return this.$message.error("用户信息编辑失败" + res.msg);
      }
      this.editDialogVisible = true;
    },
    //改变页码
    handleSizeChange(newSize) {
      this.queryMap.pageSize = newSize;
      this.getUserList();
    },
    //翻页
    handleCurrentChange(current) {
      this.queryMap.pageNum = current;
      this.getUserList();
    },
    //关闭弹出框
    closeDialog() {
      this.$refs.addFormRef.clearValidate();
      this.addForm.birth = "";
      this.addForm = {};
    },
    editClose() {
      this.$refs.editFormRef.clearValidate();
      this.editForm = {};
    },
    //改变用户禁用状态
    async changUserStatus(row) {
      const { data: res } = await this.$http.put(
        "user/updateStatus/" + row.id + "/" + row.status
      );
      if (res.code !== 200) {
        this.$message.error("更新用户状态失败:" + res.msg);
        row.status = !row.status;
      } else {
        this.$message.success("更新用户状态成功");
      }
    },
    /**
     * 加载所有部门
     */
    async getDepartmets() {
      const { data: res } = await this.$http.get("department/findAll");
      if (res.code !== 200) return this.$message.error("获取部门列表失败");
      this.departments = res.data;
    },
    showSex(row, column) {
      return row.sex == 1 ? "帅哥" : "美女";
    }
  },
  created() {
    this.getUserList();
    this.getDepartmets();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>