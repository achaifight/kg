<template>
  <div>
    <div>
      <el-dialog class="el-dialog__header" title='新建节点' :visible.sync="dialogVisible">
        <el-form :model="importForm">
          <el-form-item label="节点名称: ">
            <el-input placeholder="节点名称" style="width:600px" />
          </el-form-item>
          <el-form-item label="节点类型: ">
            <el-select placeholder="节点类型" style="width:600px">
              <el-option>人物</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button>取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row class="header">
      <el-col :span="24">
        <el-header style="background: #FFFFFF; height: 60px" ref="init">
          <h1
            style="margin-top: 4px; color: #425049; font-size:20px; background: #FFFFFF; margin-left: -0.9%; margin-right: -0.9%">
            <img src="~@/assets/image.png" style="margin: 3px; margin-top: 5px" @click="back">
            <h1 style="font-size: 20px; margin-top: -70px; margin-left: 60px">知识图谱</h1>
          </h1>
        </el-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="instruction">
        <div class="elementInfo" ref="stencilContainer">
          <span>统计数据</span>
        </div>
        <div class="stateDiv">
          <span class="labelSpan">节点数量:</span> {{ totalData['nodeCount'] }}
        </div>
        <div class="stateDiv">
          <span class="labelSpan">节点类型：</span>
          <el-div class="containDiv" v-for=" val in totalData['nodeLabels']">
            <div class="buttonCsv">
              {{ val }}
            </div>
          </el-div>
        </div>
        <br />
        <div class="stateDiv">
          <span class="labelSpan">关系数量:</span> {{ totalData['relationCount'] }}
        </div>
        <div class="stateDiv">
          <span class="labelSpan">关系类型：</span>
          <el-div class="containDiv" v-for=" val in totalData['relationTypes']">
            <div class="buttonCsv">
              {{ val }}
            </div>
          </el-div>
        </div>
        <br />
        <div class="stateDiv">
          <span class="labelSpan">数据类型：</span>
          <el-div class="containDiv" v-for=" val in totalData['properityKeys']">
            <div class="buttonCsv">
              {{ val }}
            </div>
          </el-div>
        </div>
        <div>
          <!-- <el-row class="backCardCss">
            <el-col :span="18" :offset="6">
              <button class="buttonCardCss" @click="handleOpen">知识补全</button>
            </el-col>
          </el-row>
          <el-row class="backCardCss">
            <el-col :span="18" :offset="6">
              <button class="buttonCardCss" @click="handleOpen">知识纠错</button>
            </el-col>
          </el-row>
          <el-row class="backCardCss">
            <el-col :span="18" :offset="6">
              <button class="buttonCardCss" @click="handleOpen">知识消歧</button>
            </el-col>
          </el-row> -->
          <el-row class="backCardCss">
            <el-col :span="18" :offset="6">
              <button class="buttonCardCss" @click="jump">数据库</button>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="16" class="main">
        <el-row class="schemaInfo">
          <!--          <el-col class="characters" :span="6"><span>知识图谱</span></el-col>-->
          <el-col class="btn" :span="6" :offset="15">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col class="btn" :span="1" :offset="1">
            <el-button type="primary" @click="1">保存</el-button>
          </el-col>
        </el-row>
        <el-row>
          <div id="mountNode" class="canvas" ref="mountNode"></div>
        </el-row>
      </el-col>
      <el-col :span="4" class="instruction">

        <el-row class="elementInfo">
          <span>节点信息</span>
        </el-row>
        <el-row class="property">
          <div class="stateDiv">
            <el-form :model="dataForm" size="small" label-width="auto">
              <span class="labelSpan">基础属性:</span>
              <div class="infoDiv">
                <el-form-item label="节点类型:">
                  <span>{{ nodeInfo['class'] }}</span>
                </el-form-item>
                <el-form-item label="节点名称:">
                  <span>{{ nodeInfo['name'] }}</span>
                </el-form-item>
              </div>
              <span class="labelSpan">属性:</span>
              <el-div v-for="(val, key) in nodeInfo">
                <el-form-item v-if="key != 'class' && key != 'name' && key!='relations' " :label="key + ':'">
                  <el-input :value="val" size="mini" :disabled="true"></el-input>
                </el-form-item>
              </el-div>
            </el-form>
          </div>
        </el-row>
        <!-- <el-row class="buttonClass">
          <el-col class="btn" :span="10" :offset="10">
            <el-button type="primary" @click="handleEdit">{{ true ? '保存' : '编辑' }}</el-button>
          </el-col>
        </el-row> -->

      </el-col>
    </el-row>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import insertCss from 'insert-css'
import { getGraphNode, getGraphCount, getGraphUrl } from '@/actions/GraphProjectAction';
insertCss(`
  .g6-component-contextmenu {
    padding: 0
  }
  .g6-component-contextmenu ul {
    margin: 0;
    padding: 0;
    text-align: left;
  }
  .g6-component-contextmenu ul li {
    list-style: none;
    padding: 6px 20px;
    cursor: pointer;
  }
  .g6-component-contextmenu ul li:hover {
    background: #b4b4b4;
  }
  .g6-component-toolbar {
    position: absolute;
  }
  .g6-minimap-container {
    position: absolute;
    height: 100px;
    width: 100px;
    border: 1px solid #e2e2e2;
  }
  .g6-minimap-viewport {
    border: 1px solid rgb(25, 128, 255);
  }
`)
let data = {
  'nodes': [],
  'edges': [],
};

let selectNode = '-1'
let canvasX = null, canvasY = null;     //鼠标右击点位置
function refreshDragedNodePosition(e) {
  const model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}
export default {
  name: "KnowledgeGraphView",
  data() {
    return {
      nodeInfo: { label: "人物", name: "张三", "名称": "张三", "年龄": 29, "职位": "总管" },
      edgeNum: data.edges.length,
      dialogVisible: false,
      editable: false,
      graphData: {},
      totalData: { 'nodeLabels': [], 'relationTypes': [], 'properityKeys': [], 'relationCount': 0, 'nodeCount': 0 },
      graph: null,
      dataBaseLink: "www.baidu.com"
    }
  },
  components: {},
  methods: {
    handleNodeAddOpen() {
      console.log("AAAAA")
      this.dialogVisible = true;
    },
    handleEdit() {
      this.editable = true
      console.log("ASASDSD", this.editable)
    },
    handleCount() {
      getGraphCount().then(response => {
        // console.log(response)
        this.totalData = response.data
      })
    },
    handleGetBaseLink() {
      getGraphUrl().then(response => {
        console.log(response)
        this.dataBaseLink = response.data['browser']
      })
    }, 
    handleNodeSelect(selectId){
      this.nodeInfo = this.graphData[selectId]
    },
    handleGraphDataInit(){
      getGraphNode("").then(response => {
        for(let node in data['nodes']){
          this.graphData[data['nodes'][node]['id']] = response.data['nodes'][node]
        } 
      })
    },
    jump() {
      location.href=this.dataBaseLink
      // window.open(this.dataBaseLink, '_blank')
    },
    init() {
      let graph = null;
      const width = document.getElementById('mountNode')?.scrollWidth || 800;
      // const width = 800;
      const height = document.getElementById('mountNode')?.scrollHeight || 500;
      // const height = 500;
      let mode = 'normal'
      let tmpNode = []
      const menu = new G6.Menu({
        offsetX: 6,
        offsetY: 6,
        itemTypes: ['node', 'edge', 'canvas'],
        shouldBegin(evt) {
          if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) return true;
          if (evt.item) return true;
          return false;
        },
        getContent(evt) {
          let { item } = evt;
          if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
            if (mode == 'normal') {
              return `<ul>
                        <li id="addNode" onclick="handleNodeAddOpen()">新增节点</li>
                        <li id="addEdge">新增边</li>
                    </ul>`
            } else {
              return `<ul>
                        <li id="addEdgeSave">完成边新增</li>
                    </ul>`
            }

          }
          else if (!item) return;
          let itemType = item.getType();
          if (itemType) {
            if (itemType == "node") {
              return `<ul>
                        <li id="delete">删除</li>
                      </ul>`
            }
            else if (itemType == "edge") {
              return `<ul>
                        <li id="delete">删除</li>
                      </ul>`
            }
            else return;
          }
        },
        handleMenuClick(target, item) {
          let liId = target.id;
          switch (liId) {
            case "addNode":
              // TODO 待完成节点属性等信息
              break;
            case "delete":
              graph.removeItem(item)
              break;
            case "addEdge":
              graph.setMode('addRelation');
              mode = 'addRelation'
              break;
            case "addEdgeSave":
              if (tmpNode.length == 2) {
                graph.addItem("edge", {
                  source: tmpNode[0]._cfg.id,
                  target: tmpNode[1]._cfg.id
                })
                graph.setMode('normal');
                mode = 'normal'
                break;
              }

          }
        }
      });
      const toolbar = new G6.ToolBar();
      const minimap = new G6.Minimap({
        // size: [100, 100],
        type: "delegate",
      });

      G6.registerBehavior('targetNodeSelect', {
        getEvents() {
          return {
            'node:click': 'handleRelationClick',
          }
        },
        handleRelationClick(ev) {
          let node = ev.item
          tmpNode.push(node)
          console.log("This is second node:", node,graph.find(node._cfg.id))
        }
      }
      );
      G6.registerBehavior('normalNodeSelect', {
        getEvents() {
          return {
            'node:click': 'handleNormalClick',
          }
        },
        handleNormalClick(ev) {
          let node = ev.item
          console.log("node:", node)
          handleNodeSelect(node._cfg.id)
        }
      })
      graph = new G6.Graph({
        container: "mountNode",
        width, // Number，必须，图的宽度
        height, // Number，必须，图的高度
        defaultNode: {
          size: 50,
        },
        defaultEdge: {
          style: {
            endArrow: true
          }
        },
        // 配置插件
        plugins: [menu, toolbar,],
        enabledStack: true,
        // 自适应画布
        fitView: true,
        fitCenter: true,
        // TODO 全局元素配置
        // nodeStateStyles,
        // edgeStateStyles,
        // TODO 图布局
        layout: {
          type: 'force',
          linkDistance: 150,
          preventOverlap: true,
        },
        // TODO 交互行为
        modes: {
          normal: ['drag-canvas', 'scroll-canvas', 'drag-node', 'normalNodeSelect',
            {
              type: 'click-select',
              multiple: false,
            }],
          addRelation: ['targetNodeSelect',
            {
              type: 'click-select',
              multiple: true,
            }]
        },
        mode,
        // 动画
        animate: true,
      });
      graph.setMode('normal')
      graph.data(data); // 读取数据源到图上
      graph.render();   // 渲染图
      // 事件绑定/解绑
      graph.on("node:dragstart", (ev) => {
        graph.layout()
        refreshDragedNodePosition(ev);
      })
      graph.on("node:drag", (ev) => {
        refreshDragedNodePosition(ev);
      })
      graph.on("canvas:contextmenu", (ev) => {
        canvasX = ev.canvasX
        canvasY = ev.canvasY
      })
      this.handleCount()
      this.handleGetBaseLink() 
      getGraphNode("").then(response => {
        data['nodes'] = response.data['nodes']
        data['edges'] = response.data['edges']
        graph.changeData(response.data)
      })
      this.handleGraphDataInit()
    },
    back() {
      this.$router.push({
        name: 'home'
      })
    },
    selectNode(node) {
      this.nodeInfo = node
    }
  },
  mounted() {
    this.init()
  },
  created() {
    console.log("AAAAA")
    window.handleNodeAddOpen = this.handleNodeAddOpen
    window.handleNodeSelect = this.handleNodeSelect
  }
}
</script>

<style scoped>
.header {
  background-color: #fefefe;
  height: 10vh;
  border-bottom: 2px solid black;
}

.elementInfo {
  color: #5cb6ff;
  font-size: 20px;
  font-weight: bold;
  padding: 3px 7px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.labelSpan {
  font-size: 16px;
  font-weight: 600;
  margin: 4px;
  padding: 3px 7px;
  word-break: break-all;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.infoDiv {
  margin: 10px 20px;
  border-bottom: 2px solid #fefefe;
}

.containDiv {
  padding: 5px 10px;
}

.stateDiv {
  margin: 10px 2px;
  border-bottom: 2px solid #fefefe;
}

.buttonCsv {
  background-color: rgb(165, 171, 182);
  color: rgb(255, 255, 255);
  word-break: break-all;
  cursor: pointer;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
  margin: 4px;
  padding: 3px 7px;
  display: inline-block;
  border-radius: 20px;
}

.el-icon-d-arrow-left {
  font-size: 30px;
  padding-top: 3vh;
  padding-left: 1vw;
}

.el-icon-d-arrow-left:hover {
  color: #5cb6ff;
}

.main {
  background-color: #fefefe;
  height: 90vh;
  border-left: 2px solid black;
  border-right: 2px solid black;
}

.schemaInfo {
  height: 8vh;
  border-bottom: 2px solid black;
  /*background: blue;*/
}

.characters {
  padding-left: 1vh;
  padding-top: 2vh;
  font-size: 20px;
  color: #187adf;
}

.btn {
  padding-top: 1vh;
}

.canvas {
  width: 100%;
  height: 82vh;
  overflow: hidden;
  /*background: red;*/
}

.instruction {
  background-color: #FFFFFF;
  height: 90vh;
}

.buttonClass {
  margin-top: 80%;
}

.buttonCardCss {
  /*矩形*/
  left: 1px;
  top: 0px;
  width: auto;
  height: 40px;
  opacity: 1;
  border-radius: 2px;
  margin: auto;
  margin-top: 20px;
  background: #409EFF;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);

  /** 文本1 */
  font-size: 14px;
  vertical-align: middle;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 0px;
  color: #FFFFFF;
  text-align: center;

  padding: 10px 20px;

  border: 0px;
}

.el-dialog__header {
  text-align: left;
  border-radius: 5px;
  font-size: 30px !important;
  font-weight: 600;
}
</style>