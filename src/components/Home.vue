<template>
  <el-container class="home_container">
    <!--头部导航-->
    <el-header>
      <div>
        <img src="">
        <span>论坛后台管理系统</span>
      </div>
      <el-button @click="logout">退出登录</el-button>
    </el-header>
    <!--页面布局-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_btn" @click="toggleCollapse">|||</div>
        <!--侧边菜单-->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"
                 :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id" v-for="item in menulist" :key="item.id">
            <!--一级菜单模板区域-->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.text}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.url" v-for="subItem in item.children" :key="subItem.id" @click="saveSelect('/'+subItem.url)">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>{{subItem.text}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--左侧主体内容-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Index from "element-ui/src/utils/popup";
  export default {
    components: {Index},
    data() {
      return {
        //左侧菜单数据
        menulist: [],
        iconsObj: {
          'GN002D000': 'el-icon-user\n',
          'GN003D000': 'el-icon-lock\n',
          'GN004D000': 'el-icon-s-flag\n',
          'GN005D000': 'el-icon-s-management\n',
          'GN006D000': 'el-icon-s-comment',
          'GN007D000':'el-icon-folder-opened\n',
          'GN008D000':'el-icon-s-data\n',
          'GN009D000':'el-icon-setting\n'
        },
        isCollapse: false,
        //被激活的链接地址
        activePath:''
      }
    },
    created() {
      this.getMenuList(),
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    name: "Home",
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      //获取所有菜单
      async getMenuList() {
        const {data: res} = await this.$http.get('/sys/menu')
        if (res.code !== 200) return this.$message.error("获取菜单数据失败");
        this.menulist = res.data
      },
      //点击按钮折叠菜单
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      //保持链接激活状态
      saveSelect(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
      }
    }
  }
</script>

<style scoped>
  .home_container {
    height: 100%;
    width: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 25px;

  }

  .el-header > div {
    display: flex;
    align-items: center;
    margin-left: 40px;
  }

  .el-header > div > spam {
    margin-left: 20px;
  }

  .el-aside {
    background-color: #777777;
  }

  .el-menu {
    border-right: none;
  }

  .toggle_btn {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .el-main {
    background-color: #EAEDF1;
  }
</style>
