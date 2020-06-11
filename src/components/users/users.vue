<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <!-- 首页/用户管理/用户列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2. 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input
          @clear="loadUserList()"
          clearable
          placeholder="请输入内容"
          v-model="queryInfo.query"
          class="inputSearch"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 3.表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.create_time | fmtdate }}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeMgState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            size="small"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            size="small"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetUserRoleDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <!-- 1. 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 2. 编辑用户信息对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{ currUsername }}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // query: '',
      // pagenum: 1,
      // pagesize: 2,
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 2
      },
      // 表格绑定的数据
      userlist: [],
      // 分页相关的数据
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 分配角色
      currRoleId: -1,
      currUserId: -1,
      currUsername: "",
      // 保存所有的角色
      roles:[]
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 分配角色
    async showSetUserRoleDia(user) {
      this.currUsername = user.username
      this.currUserId = user.id
      // 获取所有的角色
      const rest = await this.$http.get('roles')
      this.roles = rest.data.data

      // 获取当前角色的用户ID
      const res = await this.$http.get('users/' + user.id)
      this.currRoleId = res.data.data.rid
      this.dialogFormVisibleRole = true

    },
    async setRole(){
      const res = await this.$http.put(('users/' + this.currUserId + '/role'),{rid:this.currRoleId})
      // 关闭对话框
      this.dialogFormVisibleRole = false

    },
    // 修改状态
    async changeMgState(user) {
      const res = await this.$http.put(
        "users/" + user.id + "/state/" + user.mg_state
      )
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status === 200) {
        // 提示设置状态成功
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 编辑用户信息
    showEditUserDia(user) {
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    // 编辑用户 => 发送请求
    async editUser() {
      const res = await this.$http.put("users/" + this.form.id, this.form)
      this.dialogFormVisibleEdit = false
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status === 200) {
        // 提示更新成功
        this.$message.success(msg)
        // 更新列表视图
        this.getUserList()
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除用户
    showDeleUserMsgBox(userId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除的请求
          const res = await this.$http.delete("users/" + userId);
          console.log(userId)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.getUserList()
            this.$message({
              type: "success",
              message: res.data.meta.msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 显示添加用户对话框
    showAddUserDia() {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 添加用户
    async addUser() {
      this.dialogFormVisibleAdd = false

      const res = await this.$http.post("users", this.form)
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status === 201) {
        // 提示添加成功
        this.$message.success(msg)
        // 更新列表视图
        this.getUserList()
        // 清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 清空搜索框内容重新加载数据
    loadUserList() {
      this.getUserList()
    },
    // 搜索用户
    searchUser() {
      this.getUserList()
    },
    // 分页功能相关的方法
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 获取用户列表的请求
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      // console.log(res)
      if (res.meta.status === 200) {
        this.userlist = res.data.users
        this.total = res.data.total
        return this.$message.success("获取用户列表成功！")
      } else {
        return this.$message.error("获取用户列表失败！")
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.inputSearch {
  width: 300px;
}

.searchRow {
  margin-top: 20px;
}
</style>
