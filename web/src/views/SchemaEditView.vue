<template>
  <div>
    <el-container>
      <el-header style="background: #E5EAF7; height: 60px" ref="init">
        <h1 style="margin-top: 4px; color: #425049; font-size:20px; background: #FFFFFF; margin-left: -0.9%; margin-right: -0.9%">
          <img src="~@/assets/image.png" style="margin-bottom: 0px; margin-left: 10px">
          <h1 style="font-size: 20px; margin-top: -70px; margin-left: 60px">集团企业全要素知识图谱平台</h1>
        </h1>
      </el-header>
      <el-container style="color: #E5EAF7; background: #E5EAF7">
        <el-aside style="background: #FFFFFF; margin-top: 0.3vh; height: calc(99.7vh - 60px); width: 195px; margin-left: 6px">
          <div class="stencil" ref="stencilContainer" v-if="true"></div>
        </el-aside>
        <el-main style="background: #FFFFFF; height: calc(99.7vh - 65px); margin-top: 0.3vh; margin-left: 5px; margin-right: 5px; overflow: hidden">
          <div style="margin-bottom: 60px">
            <el-button style="float: right; margin-left: 5px" type="warning" @click="back">返回</el-button>
            <span style="float: left">{{  this.$route.query.schemaName  }}</span>
            <el-button style="float: right" type="danger" @click="save">保存</el-button>
            <el-button style="float: right; margin-right: 5px; border-color: #FFFFFF" type="info" @click="undo">撤销</el-button>
            <el-button style="float: right" type="primary" @click="changeView(visible)">{{  visible ? '隐藏' : '显示'  }}数据节点</el-button>

          </div>
          <div style="height: calc(99.7vh - 160px);" class="canvas" ref="container"></div>
        </el-main>
        <el-aside style="background: #FFFFFF; margin-top: 0.3vh; height: calc(99.7vh - 65px); width: 250px; margin-right: 6px; overflow-y: hidden">
          <div style="color: #1D2129; font-weight: bold; margin-top: -60px; float: top; display: block; height: 20px; margin-left: 5px; margin-bottom: 5px">选中元素</div>
          <div style="float: left; display: block; margin-left: 5px; height: calc(99.7vh - 200px); width: 200px">
            <Data v-show="cellType == 'Data'" :editable="editable" style="float: left"></Data>
            <Entity v-show="cellType == 'Entity'" :editable="editable"></Entity>
            <Relationship v-show="cellType == 'Relationship'" :editable="editable"></Relationship>
          </div>
          <div style="display: block; height: 5px; margin-bottom: 50px">
            <el-button type="primary" @click="handleEdit">{{  editable ? '保存' : '编辑'  }}</el-button>
            <el-button type="primary">删除</el-button>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Graph, Shape, Addon } from '@antv/x6';
import Data from "@/components/Data";
import Entity from "@/components/Entity";
import Relationship from "@/components/Relationship";
import { getSchemaGraph, getSchemaEditHelper, saveSchemaGraph } from '@/actions/SchemaActions'
import { SchemaGraphNodeUniquenessManage, JsonGraphNodeManage, SchemaGraphNodeDeleteHistory } from '@/components/SchemaGraphNodeManage'
import { handleSchemaJson } from '@/components/SchemaJsonSave'

export default {
  name: "SchemaEditView",
  data() {
    return {
      graph: undefined,
      stencil: undefined,
      cellType: undefined,
      visible: true,
      editable: false,
      dataForm: {
        label: '',
        dataRange: '',
        comment: ''
      },
      entityForm:{
        label: '',
        subClassOf: '',
        disjointWith: '',
        comment: ''
      },
      relationForm:{
        label: '',
        subPropertyOf: '',
        inverseOf: '',
        propertyDisjointWith: '',
        FunctionalProperty: 'None',
        TransitiveProperty: 'None',
        ReflexiveProperty: 'None',
        SymmetricProperty: 'None',
        comment: ''
      }
    }
  },
  components: { Data, Entity, Relationship },
  methods: {
    init() {
      this.graph = new Graph({
        // container: document.getElementById('container'),
        container: this.$refs.container,
        history: {
          enabled: true,
          beforeAddCommand(event, args) {
            if (args.key == "ports" || args.key == "tools") {
              return false
            }
          }
        },
        grid: true,
        keyboard: true,
        clipboard: {
          enabled: true,
          useLocalStorage: true,
        },
        snapline: {
          enabled: true,
          autoResize: true,
          pageVisible: true,
          pageBreak: true,
          sharp: true,
        },
        scroller: {
          enabled: true,
          pannable: {
            enabled: true,
            eventTypes: ['rightMouseDown']
          }

        },
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl'],
          minScale: 0.5,
          maxScale: 3,
        },
        resizing: {
          enabled: true,
          preserveAspectRatio: true
        },
        rotating: true,
        selecting: {
          enabled: true,
          showNodeSelectionBox: true,
          multiple: true,
          rubberband: true,
          pointerEvents: 'none'
        },
        interacting: {
          edgeMovable: true,
          arrowheadMovable: true
        },
        connecting: {
          router: {
            name: 'manhattan',
            args: {
              padding: 20,                      //设置锚点距离转角的最小距离。
            },
          },
          connector: {
            name: 'normal'
          },
          anchor: 'center',                     //当连接到节点时，通过 anchor 来指定被连接的节点的锚点
          connectionPoint: 'anchor',
          allowBlank: false,                    //是否允许连接到画布空白位置的点
          allowLoop: false,
          allowNode: false,
          snap: {
            radius: 20,                         //距离节点或者连接桩 20px 时会触发自动吸附
          },
          createEdge(metadata) {
            switch (metadata.sourceCell.shape) {
              case 'rect':
                return new Shape.Edge({
                  attrs: {
                    line: {
                      stroke: 'black',
                      strokeWidth: 2,
                      targetMarker: {
                        name: 'diamond',
                        width: 16,
                        height: 12,
                        fill: 'white'
                      },
                    },
                  },
                });
                break;
              case 'polygon':
                return new Shape.Edge({
                  attrs: {
                    line: {
                      stroke: 'black',
                      strokeWidth: 2,
                      targetMarker: {
                        name: 'block',
                        width: 12,
                        height: 8,
                      },
                    },
                  },
                });
                break;
              case 'ellipse':
                return new Shape.Edge({
                  attrs: {
                    line: {
                      stroke: 'black',
                      strokeWidth: 2,
                      sourceMarker: {
                        name: 'circle',
                        r: '5'
                      },
                      targetMarker: null,
                    },
                  },
                });
                break;
            }
          },
          validateMagnet({ magnet }) {
            return true
          },
          validateConnection({ sourceCell, targetCell }) {
            if (sourceCell.shape == 'rect' && targetCell.shape == 'ellipse') return true;
            if (sourceCell.shape == 'ellipse' && targetCell.shape == 'polygon') return true;
            if (sourceCell.shape == 'polygon' && targetCell.shape == 'ellipse') return true;
            return false
          },
        },
      });
      this.stencil = new Addon.Stencil({
        // title: 'Components',
        target: this.graph,
        // search: true,
        // collapsable: true,
        stencilGraphWidth: 200,
        stencilGraphHeight: 180,
        groups: [
          {
            name: 'group1',
            title: 'Group(Collapsable)',
          }
        ]
      })
      this.$refs.stencilContainer.appendChild(this.stencil.container)
      // 链接桩
      const ports = {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
        },
        items: [
          {
            group: 'top',
            id: 'top'
          },
          {
            group: 'right',
            id: 'right'
          },
          {
            group: 'bottom',
            id: 'bottom'
          },
          {
            group: 'left',
            id: 'left',
          },
        ],
      }
      // 控制连接桩显示/隐藏
      const showPorts = (node, ports, show) => {
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
          node.setPortProp(ports[i].id, 'attrs/circle/style/visibility', show ? 'visible' : 'hidden')
        }
      }
      // 快捷键与事件
      this.graph.bindKey(['ctrl+c'], () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.copy(cells)
        }
        return false
      })
      this.graph.bindKey(['ctrl+x'], () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.cut(cells)
        }
        return false
      })
      this.graph.bindKey(['ctrl+v'], () => {
        if (!this.graph.isClipboardEmpty()) {
          const cells = this.graph.paste({ offset: 32 })
          this.graph.cleanSelection()
          this.graph.select(cells)
        }
        return false
      })
      this.graph.bindKey(['ctrl+z'], () => {
        if (this.graph.history.canUndo()) {
          this.graph.history.undo()
        }
        return false
      })
      this.graph.bindKey('delete', () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.removeCells(cells)
        }
      })
      this.graph.on('cell:click', ({ e, x, y, cell, view }) => {
        this.graph.removeTools()
      })
      this.graph.on('blank:click', () => {
        this.graph.removeTools()
        this.cellType = undefined
      })
      this.graph.on('node:click', ({ e, x, y, node, view }) => {
        const ports = node.getPorts();
        showPorts(node, ports, false);
        node.addTools([
          {
            name: 'button-remove',
            args: {
              x: '100%',
              y: 0,
              offset: { x: 5, y: -15 },
            },
          }
        ])
        switch (node.shape) {
          case "rect":
            this.cellType = "Data";
            this.$bus.$emit("Data", node.getData())
            break;
          case "ellipse":
            this.cellType = "Entity"
            this.$bus.$emit('Entity', node.getData())
            break;
          case "polygon":
            this.cellType = "Relationship"
            this.$bus.$emit('Relationship', node.getData())
            break;
        }
      })
      this.graph.on('node:dblclick', ({ e, x, y, node, view }) => {
        node.addTools([{
          name: 'node-editor',
          args: {
            event: e,
          },
        }])
      })
      this.graph.on("node:mouseenter", ({ e, node, view }) => {
        const ports = node.getPorts();
        showPorts(node, ports, true);
      })
      this.graph.on("node:mouseleave", ({ e, node, view }) => {
        const ports = node.getPorts();
        showPorts(node, ports, false);
      })
      this.graph.on('edge:click', ({ e, x, y, edge, view }) => {
        edge.addTools([
          {
            name: 'button-remove'
          }
        ])
      })
      this.graph.on('edge:mouseenter', ({ edge }) => {
        if (!edge.getTools()) {
          edge.addTools([
            {
              name: 'boundary'
            },
            {
              name: 'source-arrowhead',
            },
            {
              name: 'target-arrowhead',
              args: {
                attrs: {
                  fill: 'red',
                },
              },
            },
          ])
        }
      })
      this.graph.on('edge:mouseleave', ({ edge }) => {
        if (edge.getTools() && !edge.getTools().items.find(item => item.name == 'button-remove'))
          edge.removeTools()
      })
      this.graph.on('node:added', ({ node, index, options }) => {
        console.log("Finish One Node Add action", node, index, options)
        this.nodeNameCheck(node)
        node.addTools([{
          name: 'node-editor',
          args: {
            event: e,
          },
        }])
        switch (node.shape) {
          case "rect":
            node.setData(this.dataForm)
            break;
          case "ellipse":
            node.setData(this.entityForm)
            break;
          case "polygon":
            node.setData(this.relationForm)
            break;
        }
        node.setData({'label': node.getAttrByPath("text/text")})
        // this.label = node.getAttrByPath("text/text")
      })
      this.graph.on('node:change:attrs', ({node, current, previous, options}) => {
          if (options.propertyPath == "attrs/text/text") {
            console.log("Finish One Node label change")
            // console.log(cell, current, previous, options)
            node.setData({'label': node.getAttrByPath("text/text")})
            console.log(node.getData())
            this.nodeNameCheck(node)
            var tmpNode = {"shape":node.shape,"label":previous.text.text}
             SchemaGraphNodeDeleteHistory(tmpNode)
          }
      })
      this.graph.on('node:removed', ({ node, index, options }) => {
        console.log("delete Node", node)
        SchemaGraphNodeDeleteHistory(node)
      })
      this.graph.on("node:move", () => {
        if (this.graph.getSelectedCells() && this.graph.getSelectedCells().length > 1) {
          this.graph.disableSnapline();
        } else {
          this.graph.enableSnapline();
        }
      });
      // 添加基础图形
      const r = new Shape.Rect({
        width: 70,
        height: 40,
        label: '数据',
        ports: { ...ports }
      })
      const e = new Shape.Ellipse({
        width: 80,
        height: 50,
        label: '实体',
        ports: { ...ports }
      })
      const p = new Shape.Polygon({
        width: 80,
        height: 50,
        label: '关系',
        points: "100,0 200,40 100,80 0,40",
        ports: { ...ports }
      })
      this.stencil.load([r, e, p], 'group1')

      getSchemaGraph(this.$route.query.schemaName).then((result) => {
        let graphData = result.data;

        // for (let index = 0; index < graphData['nodes'].length; index++) {
        //   let node = graphData['nodes'][index]
        //   node.ports = ports
        //   node.x = 100 * index
        //   node.y = 50 * index
        //   node.width = 80
        //   node.height = 40
        //   graphData['nodes'][index] = node
        // }
        for (let index = 0; index < graphData['edges'].length; index++) {
          let edge = graphData['edges'][index]
          edge.source = edge.sources
          edge.target = edge.targets
          graphData['edges'][index] = edge
        }
        console.log(graphData)
        this.graph.fromJSON(graphData)
        var nodes = this.graph.getCells();
        JsonGraphNodeManage(nodes)
        this.graph.centerContent()
        // this.graph.addEdge({source:{cell:'Class1',port:'bottom'},target:{cell:'Class2',port:'bottom'}})
      })
    },
    nodeNameCheck(node) {
      var exitNode = SchemaGraphNodeUniquenessManage(node)
      if (exitNode !== null && exitNode !== undefined) {
        if (node.shape === "ellipse") {
          alert("Cann't create class with same name")
          console.log(exitNode)
          this.graph.removeNode(node)
        } else {
          if (confirm("There is a same name node exits, whether load that node info?")) {
            node.data = exitNode.data
          } else {
            var oldLabel = node.label
            console.log("oldLabel:", oldLabel)
            node.label = (oldLabel + "_1")
          }
          console.log(exitNode)
        }
      }
      return exitNode
    },
    loadGraphData(graphData) {
      const getNodePorts = (nodesId) => {
        var tmpPorts = {
          groups: {
            top: {
              position: 'top',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#5F95FF',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#5F95FF',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            bottom: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#5F95FF',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#5F95FF',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
          }
        }
        tmpPorts.items = [
          {
            group: 'top',
            id: nodesId + 'top'
          },
          {
            group: 'right',
            id: nodesId + 'right'
          },
          {
            group: 'bottom',
            id: nodesId + 'bottom'
          },
          {
            group: 'left',
            id: nodesId + 'left'
          },
        ]
        return tmpPorts
      }
      for (var index = 0; index < graphData['nodes'].length; index++) {
        var node = graphData['nodes'][index]
        node.ports = getNodePorts(node.id)
        node.x = 100 * index
        node.y = 50 * index
        node.width = 80
        node.height = 40
        graphData['nodes'][index] = node
      }
      for (var index = 0; index < graphData['edge'].length; index++) {
        var edge = graphData['edge'][index]
        edge.source = { cell: edge.source, port: edge.source + 'left' }
        edge.target = { cell: edge.target, port: edge.target + 'right' }
        graphData['edge'][index] = edge
      }
      this.graph.fromJSON(graphData);
      //

    },
    back() {
      this.$router.push({
        name: 'home',
        params:{chooseComponents: '3-1'},
      })
    },
    changeView(visible) {
      let nodes = this.graph.getNodes()
      if (visible) {
        nodes.forEach((node) => {
          if (node.shape == 'rect')
            node.hide()
        })
      }
      else {
        nodes.forEach((node) => {
          node.show()
        })
      }
      this.visible = !visible
    },
    save() {
      console.log(this.graph.toJSON())
      let saveData = handleSchemaJson(this.graph.toJSON())
      console.log(saveData)
      saveSchemaGraph(this.$route.query.schemaName,saveData)
    },
    undo() {
      this.graph.history.undo()
    },
    handleEdit(){
      this.editable = !this.editable
      var dataForm = this.$refs.Data.dataForm
      this.$bus.$emit("Data", (dataForm))
    },
    getHelper() {
      getSchemaEditHelper()
    }
  },
  mounted() {
    this.$forceUpdate()
    this.init()
    this.$bus.$on("EditView", (form) => {
      var node = this.graph.getSelectedCells()[0]
      node.setData(form)
      node.setAttrByPath("text/text", form.label)
      console.log("editView 收到信息了")
      console.log(node.getData())
    })
    this.$forceUpdate()
  },
  beforeDestroy() {
    this.$bus.$off("EditView")
  },
}
</script>

<style scoped>
.content {
  font-family: sans-serif;
  display: flex;
}

.app-stencil {
  height: 90vh;
  width: 20vw;
  border: 1px solid #f0f0f0;
  position: relative;
}

.x6-graph-scroller {
  border: 1px solid #f0f0f0;
  margin-left: -1px;
}

.header {
  background-color: #B3C0D1;
  height: 10vh;
  border-bottom: 2px solid black;
}

.el-icon-d-arrow-left {
  font-size: 30px;
  padding-top: 3vh;
  padding-left: 1vw;
}

.el-icon-d-arrow-left:hover {
  color: #5cb6ff;
}

.aside {
  background-color: #D3DCE6;
  height: 90vh;

}

>>> .stencil {
  height: calc(99.7vh - 65px);
  position: relative;
  background: #FFFFFF;
  color: #FFFFFF;

}

.el-container{
  color: #FFFFFF;
}

.main {
  background-color: #E9EEF3;
  height: 90vh;
  border-left: 2px solid black;
  border-right: 2px solid black;
}

.schemaInfo {
  height: 8vh;
  border-bottom: 2px solid black;
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
  height: 82vh;
}

.instruction {
  background-color: #D3DCE6;
  height: 90vh;
}

.elementInfo {
  height: 8vh;
  border-bottom: 2px solid black;
  padding-top: 2vh;
  padding-left: 1vh;
  font-size: 20px;
  font-weight: 900;
}

.property {
  height: 74vh;
  display: inline-block;
  overflow: hidden;
}

#svgcontainer {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 10px;
  padding-top: 3vh;
  padding-right: 1vw;
}

#headerContainer {
  display: flex;
}

>>> .Addon{
  color: #FFFFFF;
}

</style>