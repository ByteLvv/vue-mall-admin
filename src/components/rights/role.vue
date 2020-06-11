<template>
  <el-card>
    <!-- 1. 面包屑 首页=>权限管理=>权限列表 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <el-button class="addrolebtn" type="primary" @click="showAddRoleDia()">添加角色</el-button>

    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag @close="deleRight(scope.row,item1.id)" closable>{{ item1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag @close="deleRight(scope.row,item2.id)" closable type="success">{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleRight(scope.row,item3.id)" closable type="warning" v-for="(item3,i) in item2.children" :key="i">{{ item3.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="showEditRoleDia(scope.row)" >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="showDeleRoleMsgBox(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDia(scope.row)">分配权限</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

     <!-- 1. 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAddRole">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px" hide-required-asterisk="true">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddRole = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 2. 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEditRole">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px" hide-required-asterisk="true">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 3. 分配权限 -->
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="treelist"
        show-checkbox
        node-key="id"
        :default-expanded-keys="arrexpand"
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: {},
      dialogFormVisibleAddRole: false,
      dialogFormVisibleEditRole: false,
      setRightDialogVisible: false,
      form:{
        roleName:'',
        roleDesc:''
      },
      //树形结构的数据
      treelist:[],
      defaultProps:{
        label:'authName',
        children:'children'
      },
      arrexpand:[],
      arrcheck:[]
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
   // 获取角色列表
    // async getRolelist() {
    //   const res = await this.$http.get("roles")
    //   // console.log(res)
    //   this.rolelist = res.data.data
    //   console.log(this.rolelist)
    // },
    async getRoleList() {
      const { data: res } = await this.$http.get("roles")
      // console.log(res)
      if (res.meta.status === 200) {
        this.rolelist = res.data
        return this.$message.success("获取用户列表成功！")
      } else {
        return this.$message.error("获取用户列表失败！")
      }
    },
    // 取消权限
    async deleRight(role,rightId){
      // 请求路径：roles/:roleId/rights/:rightId
      // 请求方法：delete
      const res = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
      role.children = res.data.data
    },
    // 添加角色
    showAddRoleDia() {
      this.form = {}
      this.dialogFormVisibleAddRole = true
    },
    async addRole() {
      this.dialogFormVisibleAddRole = false
      const res = await this.$http.post("roles", this.form)
      const {meta: { status, msg },data} = res.data
      if (status === 201) {
        // 提示添加成功
        this.$message.success(msg)
        // 更新列表视图
        this.getRoleList()
        // 清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 编辑角色
    showEditRoleDia(role) {
      this.dialogFormVisibleEditRole = true
      this.form = role
    },
    async editRole() {
      const res = await this.$http.put("roles/" + this.form.id, this.form)
      this.dialogFormVisibleEditRole = false
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status === 200) {
        // 提示更新成功
        this.$message.success("更新成功")
        // 更新列表视图
       // this.getRoleList()
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除角色
    showDeleRoleMsgBox(roleId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除的请求
          const res = await this.$http.delete("roles/" + roleId);
          if (res.data.meta.status === 200) {
            this.getRoleList()
            this.$message.success(res.data.meta.msg)

          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配权限
    async showSetRightDia(role){
      // 获取树形结构的权限数据
      const res = await this.$http.get('rights/tree')
      this.treelist = res.data.data
      // 三层嵌套
      var arrtemp1 = []
      this.treelist.forEach(item1 => {
        arrtemp1.push(item1.id)
        item1.children.forEach(item2 => {
          arrtemp1.push(item2.id)
          item2.children.forEach(item3 => {
          arrtemp1.push(item3.id)
          })
        })
      })
      this.arrexpand = arrtemp1

      // 获取当前角色role的权限id
      let arrtemp2 = []
      role.children.forEach(item1 => {
        arrtemp2.push(item1.id)
        item1.children.forEach(item2 => {
          arrtemp2.push(item2.id)
          item2.children.forEach(item3 => {
          arrtemp2.push(item3.id)
          })
        })
      })
      this.arrcheck = arrtemp2
      this.setRightDialogVisible = true
    }

  }
}
</script>

<style>
.addrolebtn{
  margin-top: 20px;
}
</style>
