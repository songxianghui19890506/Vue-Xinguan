<template>
  <div id="stocks">
        <!-- 面包导航 -->
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存维护</el-breadcrumb-item>
    </el-breadcrumb> 

    
    <!-- 下部分 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple-dark">
          <el-card class="box-card">
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
                <div id="tianxing" style="width: 650px;height:370px;"></div>
          </el-card>
          <el-card class="box-card" style="margin-top:10px;">
            <!-- 库存饼图 -->
                <div id="bingtu" style="width: 550px;height:250px;"></div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-dark">
          <el-card class="box-card">
           <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="物资名称">
                        <el-input clearable @clear="search" v-model="queryMap.name" placeholder="物资名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                    </el-form>
                    <el-table
                        border
                        :data="tableData"
                        style="width: 100%">
                        <el-table-column
                        prop="name"
                        label="名称"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="model"
                        label="规格"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="stock"
                        label="库存">
                        </el-table-column>
                        <el-table-column
                        prop="unit"
                        label="单位">
                        </el-table-column>
                    </el-table>
                  
                   
                      <!-- 分页 -->
                    <el-pagination
                    style="margin-top:20px;"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryMap.pageNo"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
               
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return {
            total:0,
            tableData:[],
            queryMap:{pageSize:10,pageNo:1},
            xData:[],
            yData:[],
            legendData:[],//饼图存放物资名称
            selected:{},//存放选择的数据
            seriesData:[{name:'',value:''}]//饼图数据

        }
    },
    methods:{
        /**
         * 搜索
         */
        search(){
          this.queryMap.pageNo=1;
          this.getStockList();  
        },
        /**
         * 加载库存信息
         */
        async getStockList() {
        const { data: res } = await this.$http.get("product/findProductStocks", {
            params: this.queryMap
        });
        if (res.code !== 200) {
            return this.$message.error("获取物资库存列表失败");
        } else {
            this.total = res.data.total;
            this.tableData = res.data.rows;
            this.xData=[];
            this.yData=[];
            this.selected={};
            var $this=this;
            //构建表格条形统计图的数据
            this.tableData.forEach(function(e){  
                $this.xData.push(e.name)
                $this.yData.push(e.stock);
            });
            //重新绘制表格
            this.draw();
        }
        },

         //改变页码
        handleSizeChange(newSize) {
        this.queryMap.pageSize = newSize;
        this.getStockList();
        },
        //翻页
        handleCurrentChange(current) {
        this.queryMap.pageNum = current;
        this.getStockList();
        },
        /**
         * 绘制条形统计图
         */
        draw(){
            var myChart = echarts.init(document.getElementById('tianxing'));
            // 指定图表的配置项和数据
            var option={
                title: {
                    text: '物资库存图'
                },
                tooltip: {},
                legend: {
                    data:['库存量']
                },
                xAxis: {
                    data: this.xData,
                },
                yAxis: {},
                series: [{
                    name: '库存量',
                    type: 'bar',
                    data: this.yData,
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        /**
         * 绘制饼图
         */
        drawRound(){
          var myChart = echarts.init(document.getElementById('bingtu'));
          var option = {
                title: {
                    text: '物资库存数量统计',
                    subtext: '纯属虚构',
                    left: 'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: this.legendData,

                    selected: this.selected
                },
                series: [
                    {
                        name: '物资名称',
                        type: 'pie',
                        radius: '55%',
                        center: ['40%', '50%'],
                        data: this.seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        },

        /**
         * 物资所有的库存信息
         */      
        async findAllProductStocks() {
            const { data: res } = await this.$http.get("product/findAllStocks", {
                params: this.queryMap
            });
            if (res.code !== 200) {
                return this.$message.error("获取物资所有库存失败");
            } else {
                this.legendData=[];
                this.selected={};
                this.seriesData=[{}];
                var $this =this;
                //构建饼图的数据对象
                res.data.forEach(function(e){  
                    $this.legendData.push(e.name);
                    $this.seriesData.push({name:e.name,value:e.stock});
                });

              //重新绘制表格
              this.drawRound();
            }

        },
    },
    created(){
        this.getStockList();
        this.findAllProductStocks();
    },
    mounted: function() {
      this.draw();
      this.drawRound();
    },
}
</script>